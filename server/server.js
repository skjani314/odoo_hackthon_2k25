// server.js - Complete Backend for Skill Swap Platform

// --- 1. Setup and Imports ---
import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary'; // ES6 import for Cloudinary
import cors from 'cors';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Configuration ---

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Nodemailer Config
const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
if (!NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
  console.warn('WARNING: NODEMAILER_EMAIL or NODEMAILER_PASSWORD not set. Email functionalities will be disabled.');
}

const transporter = NODEMAILER_EMAIL && NODEMAILER_PASSWORD ? nodemailer.createTransport({
  service: 'gmail', // Or your email service provider (e.g., 'smtp.mailtrap.io' for testing)
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
}) : null;

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('WARNING: Cloudinary credentials not fully set. Image upload functionality will be limited or disabled.');
} else {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

// --- 3. MongoDB Connection ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
  });

// --- 4. Models (Mongoose Schemas) ---

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  profilePhoto: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_fill,g_auto/sample.jpg' }, // Default placeholder
  location: { type: String, trim: true },
  skillsOffered: [{ type: String, trim: true }],
  skillsWanted: [{ type: String, trim: true }],
  availability: { type: String, trim: true },
  isPublic: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// SwapRequest Schema
const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsInvolved: [{ type: String, required: true, trim: true }],
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

// --- 5. Middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // Enable CORS for all origins (adjust for production, e.g., { origin: 'http://localhost:3000' })

// Custom Error Handler Middleware (Centralized)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the stack trace for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  res.status(statusCode).json({
    success: false,
    message: message,
    // In production, you might not want to send the full error stack
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// --- 6. Authentication Middleware ---

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access Denied: Token expired.' });
      }
      return res.status(403).json({ success: false, message: 'Access Denied: Invalid token.' });
    }
    req.user = user; // Attach user payload (id, role) to request
    next();
  });
};

// Middleware to authorize user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access Denied: You do not have the required permissions.' });
    }
    next();
  };
};

// --- 7. Utility Functions (Email, OTP, Image Upload) ---

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  if (!transporter) {
    console.error('Nodemailer transporter not configured. Cannot send email.');
    return { success: false, message: 'Email service not available.' };
  }
  try {
    await transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return { success: false, message: 'Failed to send email.' };
  }
};

// Function to generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Function to upload image to Cloudinary (conceptual, requires file handling middleware like multer)
// This function assumes `imagePath` is a local file path or a base64 string.
// For actual file uploads from client, you'd integrate `multer` middleware.
const uploadImageToCloudinary = async (imagePath) => {
  if (!cloudinary.config().cloud_name) {
    console.warn('Cloudinary not configured. Skipping image upload.');
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'skill_swap_profiles', // Optional: specify a folder for organization
      // resource_type: 'auto', // Automatically detect file type
    });
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    // In a real app, you might throw an error or handle it more gracefully
    return null;
  }
};

// --- 8. Controllers ---

// --- Auth Controllers ---
const authController = {
  signup: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user = new User({ name, email, password, otp, otpExpires, isVerified: false });
        await user.save(); // Password will be hashed by pre-save hook

        const emailSent = await sendEmail(
          email,
          'Skill Swap: Verify Your Email',
          `Your OTP for Skill Swap is: ${otp}. It is valid for 10 minutes.`,
          `<p>Your OTP for Skill Swap is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
        );

        if (!emailSent.success) {
          console.warn('OTP email failed to send for new user:', email);
          // In production, you might roll back user creation or mark for manual verification.
          // For now, we proceed but log the warning.
        }

        res.status(201).json({ success: true, message: 'User registered successfully. Please verify your email with the OTP sent to your inbox.', emailForVerification: email });
      } catch (err) {
        next(err); // Pass error to central error handler
      }
    }
  ],

  verifyOtp: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, otp } = req.body;
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
        if (user.isVerified) {
          return res.status(400).json({ success: false, message: 'Email already verified.' });
        }
        if (user.otp !== otp || user.otpExpires < Date.now()) {
          return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined; // Clear OTP expiry
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Email verified successfully!', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, profilePhoto: user.profilePhoto } });
      } catch (err) {
        next(err);
      }
    }
  ],

  sendOtp: [
    body('email').isEmail().withMessage('Valid email is required'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // Send a generic success message to prevent email enumeration
          return res.status(200).json({ success: true, message: 'If an account with that email exists, a new OTP has been sent.' });
        }
        if (user.isVerified) {
          return res.status(400).json({ success: false, message: 'Email already verified. Please login.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const emailSent = await sendEmail(
          email,
          'Skill Swap: Your New OTP',
          `Your new OTP for Skill Swap is: ${otp}. It is valid for 10 minutes.`,
          `<p>Your new OTP for Skill Swap is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
        );

        if (!emailSent.success) {
          return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again later.' });
        }

        res.status(200).json({ success: true, message: 'New OTP sent to your email.' });
      } catch (err) {
        next(err);
      }
    }
  ],

  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        if (!user.isVerified) {
          return res.status(403).json({ success: false, message: 'Please verify your email address first.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        res.status(200).json({ success: true, message: 'Logged in successfully!', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, profilePhoto: user.profilePhoto } });
      } catch (err) {
        next(err);
      }
    }
  ],

  forgotPassword: [
    body('email').isEmail().withMessage('Valid email is required'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // Send a generic success message even if user not found to prevent email enumeration
          return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate a unique, cryptographically secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        // Hash the token before saving to DB, but send the unhashed one to user
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`; // Adjust frontend URL as needed
        // In a real app, this should link to your frontend reset password page, e.g., `http://localhost:3000/#/reset-password?token=${resetToken}`

        const emailSent = await sendEmail(
          user.email,
          'Skill Swap: Password Reset Request',
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetUrl}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.`,
          `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        );

        if (!emailSent.success) {
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save();
          return res.status(500).json({ success: false, message: 'Failed to send password reset email. Please try again later.' });
        }

        res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
      } catch (err) {
        next(err);
      }
    }
  ],

  resetPassword: [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { token, newPassword } = req.body;
      // Hash the token received from the user to compare with the hashed token in DB
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      try {
        const user = await User.findOne({
          passwordResetToken: hashedToken,
          passwordResetExpires: { $gt: Date.now() } // Token must not be expired
        });

        if (!user) {
          return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }

        user.password = newPassword; // Pre-save hook will hash this
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.isVerified = true; // Ensure user is verified after password reset
        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset successfully!' });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Get current user details (for authenticated users)
  getMe: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password -otp -otpExpires -passwordResetToken -passwordResetExpires');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
};

// --- User Controllers ---
const userController = {
  // Get all public users (for browse skills)
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find({ isPublic: true }).select('-password -otp -otpExpires -passwordResetToken -passwordResetExpires');
      res.status(200).json({ success: true, users });
    } catch (err) {
      next(err);
    }
  },

  // Get a specific public user's profile
  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select('-password -otp -otpExpires -passwordResetToken -passwordResetExpires');
      if (!user || !user.isPublic) {
        return res.status(404).json({ success: false, message: 'User not found or profile is private.' });
      }
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  // Update user's own profile
  updateProfile: [
    authenticateToken,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.user.id;
      const updates = req.body; // Can include name, location, skillsOffered, skillsWanted, availability, isPublic, profilePhoto

      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Prevent updating role or isVerified directly via this endpoint
        delete updates.role;
        delete updates.isVerified;
        delete updates.password; // Password changes should go through specific reset/change password flows

        // Handle profile photo upload if provided (conceptual)
        if (updates.profilePhoto && updates.profilePhoto.startsWith('data:image')) {
          // This assumes updates.profilePhoto is a base64 string
          const imageUrl = await uploadImageToCloudinary(updates.profilePhoto);
          if (imageUrl) {
            updates.profilePhoto = imageUrl;
          } else {
            console.warn('Failed to upload profile photo to Cloudinary.');
            delete updates.profilePhoto; // Don't update if upload failed
          }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select('-password -otp -otpExpires -passwordResetToken -passwordResetExpires');

        res.status(200).json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Admin: Ban a user
  banUser: [
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res, next) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
        if (user.role === 'admin') {
          return res.status(403).json({ success: false, message: 'Cannot ban another admin.' });
        }
        user.status = 'banned'; // Assuming a 'status' field in user schema for banned users
        await user.save();
        res.status(200).json({ success: true, message: `User ${user.email} has been banned.` });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Admin: Unban a user
  unbanUser: [
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res, next) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
        user.status = 'active'; // Assuming a 'status' field
        await user.save();
        res.status(200).json({ success: true, message: `User ${user.email} has been unbanned.` });
      } catch (err) {
        next(err);
      }
    }
  ],
};

// --- Swap Request Controllers ---
const swapController = {
  // Create a new swap request
  createSwapRequest: [
    authenticateToken,
    body('recipientId').notEmpty().withMessage('Recipient ID is required'),
    body('skillsInvolved').isArray({ min: 1 }).withMessage('At least one skill must be involved'),
    body('message').notEmpty().withMessage('Message is required'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { recipientId, skillsInvolved, message } = req.body;
      const senderId = req.user.id;

      if (senderId === recipientId) {
        return res.status(400).json({ success: false, message: 'Cannot send a swap request to yourself.' });
      }

      try {
        const recipient = await User.findById(recipientId);
        if (!recipient || !recipient.isPublic) {
          return res.status(404).json({ success: false, message: 'Recipient not found or their profile is private.' });
        }

        const newRequest = new SwapRequest({
          sender: senderId,
          recipient: recipientId,
          skillsInvolved,
          message,
          status: 'pending',
        });
        await newRequest.save();

        // Optionally send email notification to recipient
        const sender = await User.findById(senderId);
        if (sender && transporter) {
          await sendEmail(
            recipient.email,
            'Skill Swap: New Swap Request!',
            `You have received a new skill swap request from ${sender.name}. Check your dashboard to respond.`,
            `<p>You have received a new skill swap request from <strong>${sender.name}</strong>.</p>
            <p>Message: "${message}"</p>
            <p>Skills involved: ${skillsInvolved.join(', ')}</p>
            <p>Please log in to your Skill Swap dashboard to respond.</p>`
          );
        }

        res.status(201).json({ success: true, message: 'Swap request sent successfully!', request: newRequest });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Get all swap requests sent by the current user
  getSentRequests: [
    authenticateToken,
    async (req, res, next) => {
      try {
        const requests = await SwapRequest.find({ sender: req.user.id })
          .populate('recipient', 'name email profilePhoto') // Populate recipient details
          .populate('sender', 'name email profilePhoto'); // Populate sender details
        res.status(200).json({ success: true, requests });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Get all swap requests received by the current user
  getReceivedRequests: [
    authenticateToken,
    async (req, res, next) => {
      try {
        const requests = await SwapRequest.find({ recipient: req.user.id })
          .populate('sender', 'name email profilePhoto') // Populate sender details
          .populate('recipient', 'name email profilePhoto'); // Populate recipient details
        res.status(200).json({ success: true, requests });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Update status of a swap request (accept, reject, cancel)
  updateSwapRequestStatus: [
    authenticateToken,
    body('status').isIn(['accepted', 'rejected', 'cancelled']).withMessage('Invalid status'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { status } = req.body;
      const requestId = req.params.id;
      const userId = req.user.id;

      try {
        const request = await SwapRequest.findById(requestId);
        if (!request) {
          return res.status(404).json({ success: false, message: 'Swap request not found.' });
        }

        // Only recipient can accept/reject
        if (status === 'accepted' || status === 'rejected') {
          if (request.recipient.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action on this request.' });
          }
        }
        // Only sender can cancel
        if (status === 'cancelled') {
          if (request.sender.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this request.' });
          }
        }

        // Prevent status changes from final states (accepted/rejected/cancelled)
        if (request.status !== 'pending') {
          return res.status(400).json({ success: false, message: `Request is already ${request.status}. Cannot change status.` });
        }

        request.status = status;
        await request.save();

        // Optionally send email notification to the other party
        const otherPartyId = request.sender.toString() === userId ? request.recipient : request.sender;
        const otherParty = await User.findById(otherPartyId);
        const currentUser = await User.findById(userId);

        if (otherParty && currentUser && transporter) {
          let emailSubject = '';
          let emailText = '';
          let emailHtml = '';

          switch (status) {
            case 'accepted':
              emailSubject = 'Skill Swap Request Accepted!';
              emailText = `${currentUser.name} has accepted your skill swap request for ${request.skillsInvolved.join(', ')}.`;
              emailHtml = `<p><strong>${currentUser.name}</strong> has accepted your skill swap request for <strong>${request.skillsInvolved.join(', ')}</strong>.</p><p>Please connect with them to arrange the swap!</p>`;
              break;
            case 'rejected':
              emailSubject = 'Skill Swap Request Rejected';
              emailText = `${currentUser.name} has rejected your skill swap request for ${request.skillsInvolved.join(', ')}.`;
              emailHtml = `<p><strong>${currentUser.name}</strong> has rejected your skill swap request for <strong>${request.skillsInvolved.join(', ')}</strong>.</p>`;
              break;
            case 'cancelled':
              emailSubject = 'Skill Swap Request Cancelled';
              emailText = `${currentUser.name} has cancelled the skill swap request for ${request.skillsInvolved.join(', ')}.`;
              emailHtml = `<p><strong>${currentUser.name}</strong> has cancelled the skill swap request for <strong>${request.skillsInvolved.join(', ')}</strong>.</p>`;
              break;
          }
          await sendEmail(otherParty.email, emailSubject, emailText, emailHtml);
        }

        res.status(200).json({ success: true, message: `Swap request status updated to ${status}.`, request });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Delete/Archive a swap request (can be done by either sender or recipient after it's not pending)
  deleteSwapRequest: [
    authenticateToken,
    async (req, res, next) => {
      const requestId = req.params.id;
      const userId = req.user.id;

      try {
        const request = await SwapRequest.findById(requestId);
        if (!request) {
          return res.status(404).json({ success: false, message: 'Swap request not found.' });
        }

        // Only the sender or recipient can delete/archive the request
        if (request.sender.toString() !== userId && request.recipient.toString() !== userId) {
          return res.status(403).json({ success: false, message: 'You are not authorized to delete this request.' });
        }

        // For simplicity, we'll actually delete it. In a real app, you might soft-delete or archive.
        await SwapRequest.findByIdAndDelete(requestId);
        res.status(200).json({ success: true, message: 'Swap request deleted successfully.' });
      } catch (err) {
        next(err);
      }
    }
  ],
};

// --- Admin Controllers ---
const adminController = {
  // Send platform-wide messages (conceptual - in a real app, this might involve a messaging service)
  sendPlatformMessage: [
    authenticateToken,
    authorizeRoles('admin'),
    body('message').notEmpty().withMessage('Message content is required.'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { message } = req.body;
      try {
        // In a real application, this would iterate through users and send emails/notifications
        // For now, just log and simulate success.
        console.log(`Admin sent platform message: "${message}"`);
        // Example: Fetch all users and send email to each (be careful with rate limits!)
        // const allUsers = await User.find().select('email');
        // for (const user of allUsers) {
        //   await sendEmail(user.email, 'Skill Swap: Platform Update', message, `<p>${message}</p>`);
        // }
        res.status(200).json({ success: true, message: 'Platform message sent successfully (simulated).' });
      } catch (err) {
        next(err);
      }
    }
  ],

  // Download reports (conceptual - in a real app, this would generate CSV/PDF)
  downloadReport: [
    authenticateToken,
    authorizeRoles('admin'),
    async (req, res, next) => {
      const { reportType } = req.params; // e.g., 'user_activity', 'feedback_logs', 'swap_stats'
      try {
        // Simulate fetching data for the report
        let reportData = [];
        let filename = `${reportType}_report.json`; // Default to JSON

        switch (reportType) {
          case 'user_activity':
            reportData = await User.find().select('name email createdAt updatedAt -_id');
            break;
          case 'feedback_logs':
            // Assuming a Feedback model exists, or pulling from user activity logs
            reportData = [{ id: 'dummy_feedback_1', user: 'user123', content: 'Great platform!', date: new Date() }];
            break;
          case 'swap_stats':
            reportData = await SwapRequest.aggregate([
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);
            break;
          default:
            return res.status(400).json({ success: false, message: 'Invalid report type.' });
        }

        // For simplicity, sending as JSON. In a real app, you'd generate CSV/Excel.
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(JSON.stringify(reportData, null, 2));
      } catch (err) {
        next(err);
      }
    }
  ],
};

// --- 9. Routes ---

const authRoutes = express.Router();
authRoutes.post('/signup', authController.signup);
authRoutes.post('/verify-otp', authController.verifyOtp);
authRoutes.post('/send-otp', authController.sendOtp); // For resending OTP or verifying unverified users
authRoutes.post('/login', authController.login);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);
authRoutes.get('/me', authenticateToken, authController.getMe); // Get current user's profile

const userRoutes = express.Router();
userRoutes.get('/', userController.getAllUsers); // Get all public users
userRoutes.get('/:id', userController.getUserById); // Get public profile by ID
userRoutes.put('/profile', authenticateToken, userController.updateProfile); // Update own profile
// Admin routes for user management
userRoutes.put('/:id/ban', authenticateToken, authorizeRoles('admin'), userController.banUser);
userRoutes.put('/:id/unban', authenticateToken, authorizeRoles('admin'), userController.unbanUser);


const swapRoutes = express.Router();
swapRoutes.post('/', authenticateToken, swapController.createSwapRequest);
swapRoutes.get('/sent', authenticateToken, swapController.getSentRequests);
swapRoutes.get('/received', authenticateToken, swapController.getReceivedRequests);
swapRoutes.put('/:id/status', authenticateToken, swapController.updateSwapRequestStatus); // Accept/Reject/Cancel
swapRoutes.delete('/:id', authenticateToken, swapController.deleteSwapRequest); // Delete/Archive


const adminRoutes = express.Router();
adminRoutes.post('/message', adminController.sendPlatformMessage);
adminRoutes.get('/reports/:reportType', adminController.downloadReport);

// --- 10. Integrate Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes); // Admin routes should be protected by authorizeRoles middleware within controllers

// --- 11. Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Endpoints:');
  console.log(`  Auth: /api/auth/{signup, verify-otp, send-otp, login, forgot-password, reset-password, me}`);
  console.log(`  Users: /api/users/{, :id, profile, :id/ban, :id/unban}`);
  console.log(`  Swaps: /api/swaps/{, sent, received, :id/status, :id}`);
  console.log(`  Admin: /api/admin/{message, reports/:reportType}`);
});
