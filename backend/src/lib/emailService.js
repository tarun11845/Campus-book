import * as Brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOTPEmail = async (email, otp, name, isAdminVerification = false, isForgotPassword = false) => {
  const subject = isAdminVerification 
    ? 'NITK Sports Booking - Admin Verification OTP'
    : isForgotPassword
    ? 'NITK Sports Booking - Password Reset OTP'
    : 'NITK Sports Booking - Email Verification OTP';

  const greeting = isAdminVerification ? `Hello Admin,` : `Hello ${name},`;
  const purpose = isAdminVerification
    ? 'A new admin account requires verification.'
    : isForgotPassword
    ? 'You requested a password reset. Your OTP is:'
    : 'Your verification OTP is:';

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
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
  `;
  sendSmtpEmail.sender = { name: 'CampusBook', email: process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ email: email, name: name || 'User' }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};