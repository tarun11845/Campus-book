import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== "production") {
  console.log('Email credentials check:', {
    user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
  });
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


transporter.verify((error) => {
  if (error) {
    console.log('Transporter verification failed:', error);
  } else {
    console.log('Email service ready');
  }
});

export const sendOTPEmail = async (email, otp, name, isAdminVerification = false, isForgotPassword = false) => {
  const subject = isAdminVerification 
    ? 'NITK Sports Booking - Admin Account Verification OTP'
    : isForgotPassword
    ? 'NITK Sports Booking - Password Reset OTP'
    : 'NITK Sports Booking - Email Verification OTP';
    
  const greeting = isAdminVerification 
    ? `Hello Admin,`
    : `Hello ${name},`;
    
  const purpose = isAdminVerification
    ? 'A new admin account requires verification.'
    : isForgotPassword
    ? 'You requested a password reset. Your OTP is:'
    : 'Your verification OTP is:';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2>NITK Sports Booking System</h2>
        <p>${greeting}</p>
        <p>${purpose}</p>
        <div style="background:#f1f1f1;padding:20px;text-align:center;margin:20px 0;">
          <h1 style="color:#e74c3c;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
