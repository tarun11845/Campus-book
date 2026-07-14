import express from 'express';
import { body } from 'express-validator';
import {
  sendOTP,
  verifyOTP,
  verifyAdminOTP,
  register,
  login,
  logout,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword
} from '../controllers/auth.controller.js';

const router = express.Router();

// Reusable validators
const nitkEmailValidator = body('email')
  .isEmail()
  .custom(email => {
    if (!email.endsWith('@nitk.edu.in')) {
      throw new Error('Only NITK college emails are allowed');
    }
    return true;
  });

const otpValidator = body('otp').isLength({ min: 6, max: 6 });

// ========================
// ROUTES
// ========================

// POST /api/auth/send-otp
router.post('/send-otp', [nitkEmailValidator], sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', [body('email').isEmail(), otpValidator], verifyOTP);

// POST /api/auth/verify-admin-otp
router.post('/verify-admin-otp', [body('userId').isMongoId(), otpValidator], verifyAdminOTP);

// POST /api/auth/register
router.post('/register', [
  body('name').isString().notEmpty(),
  nitkEmailValidator,
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['student', 'admin']),
  body('gender').isIn(['male', 'female'])
], register);

// POST /api/auth/login
router.post('/login', [body('email').isEmail(), body('password').isString()], login);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /api/auth/forgot-password
router.post('/forgot-password', [nitkEmailValidator], forgotPassword);

// POST /api/auth/verify-forgot-password-otp
router.post('/verify-forgot-password-otp', [body('email').isEmail(), otpValidator], verifyForgotPasswordOTP);

// POST /api/auth/reset-password
router.post('/reset-password', [
  body('resetToken').isString(),
  body('newPassword').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], resetPassword);

export default router;