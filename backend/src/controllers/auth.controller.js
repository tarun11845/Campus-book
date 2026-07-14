import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../lib/emailService.js';

// ========================
// SEND OTP
// ========================
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendOTPEmail(email, otp, user.name);
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    return res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ========================
// VERIFY OTP
// ========================
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    if (user.role === 'admin') {
      const adminOtp = user.generateOTP();
      user.isAdminVerified = false;
      await user.save();

      const adminEmail = 'tarundhote325@gmail.com';
      const emailSent = await sendOTPEmail(adminEmail, adminOtp, 'Admin', true);
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send admin verification email' });
      }

      return res.json({
        message: 'Email verified. Admin OTP sent to the admin email for final approval.',
        requiresAdminVerification: true,
        userId: user._id
      });
    }

    await user.save();
    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// ========================
// VERIFY ADMIN OTP
// ========================
export const verifyAdminOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(404).json({ error: 'Invalid request' });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ error: 'User email must be verified first' });
    }

    if (user.isAdminVerified) {
      return res.status(400).json({ error: 'Admin account already verified' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isAdminVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.json({ message: 'Admin verification successful. Account created.' });
  } catch (error) {
    console.error('Admin verify OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify admin OTP' });
  }
};

// ========================
// REGISTER
// ========================
export const register = async (req, res) => {
  const { name, email, password, role, gender } = req.body;

  try { console.log('Register payload (sanitized):', { email, role, gender }); } catch {}

  const normalizedGender = typeof gender === 'string' ? gender.toLowerCase().trim() : '';
  if (!normalizedGender || !['male', 'female'].includes(normalizedGender)) {
    return res.status(400).json({ error: 'Gender is required and must be male or female' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    if (role === 'admin') {
      const user = new User({ name, email, role, gender: normalizedGender });
      await user.setPassword(password);

      const otp = user.generateOTP();
      await user.save();

      const emailSent = await sendOTPEmail(email, otp, name);
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send email verification OTP' });
      }

      return res.status(201).json({
        message: 'Registration created. Please verify your email with the OTP sent to your email address.',
        userId: user._id,
        requiresEmailVerification: true,
        role: 'admin'
      });
    } else {
      const user = new User({ name, email, role: role || 'student', gender: normalizedGender });
      await user.setPassword(password);

      const otp = user.generateOTP();
      await user.save();

      const emailSent = await sendOTPEmail(email, otp, name);
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }

      return res.status(201).json({
        message: 'Registration successful. Please check your email for OTP verification.',
        userId: user._id,
        requiresEmailVerification: true
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// ========================
// LOGIN
// ========================
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: 'Please verify your email with OTP before logging in' });
    }

    if (user.role === 'admin' && !user.isAdminVerified) {
      return res.status(403).json({ error: 'Admin account pending final admin approval. Please complete admin verification.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, gender: user.gender },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// ========================
// LOGOUT
// ========================
export const logout = (req, res) => {
  // JWT stateless hai — frontend token delete karega
  return res.json({ message: 'Logged out successfully' });
};

// ========================
// FORGOT PASSWORD
// ========================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ error: 'Please verify your email first before resetting password.' });
    }

    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendOTPEmail(email, otp, user.name, false, true);
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    return res.json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to send reset OTP' });
  }
};

// ========================
// VERIFY FORGOT PASSWORD OTP
// ========================
export const verifyForgotPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.resetPasswordToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '15m' }
    );
    await user.save();

    return res.json({
      message: 'OTP verified successfully',
      resetToken: user.resetPasswordToken
    });
  } catch (error) {
    console.error('Verify forgot password OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// ========================
// RESET PASSWORD
// ========================
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'dev_secret');
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.setPassword(newPassword);
    user.resetPasswordToken = null;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};