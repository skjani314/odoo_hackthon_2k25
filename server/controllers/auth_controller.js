import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User


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