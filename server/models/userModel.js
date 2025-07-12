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