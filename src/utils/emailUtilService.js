const nodemailer = require('nodemailer');
const verificationEmail = require('../templates/verification-email');
const resetPasswordEmail = require('../templates/reset-password');
const sendInvitationEmail = require('../templates/sendInvitationEmail');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailService {
  async sendVerificationEmail(email, token) {
    const html = verificationEmail(email, token);
    const text = `Please verify your email: ${process.env.FRONTEND_URL}/auth/verify-email?verify=${token}`;
    
    await this._sendEmail({
      to: email,
      subject: `Verify Your ${process.env.APP_NAME} Account`,
      html,
      text,
    });
  }

  async sendPasswordResetEmail(email, token) {
    const html = resetPasswordEmail(email, token);
    const text = `Reset your password: ${process.env.FRONTEND_URL}/auth/reset-password?resetPassword=${token}`;
    
    await this._sendEmail({
      to: email,
      subject: `Reset Your ${process.env.APP_NAME} Password`,
      html,
      text,
    });
  }

  async sendInvitationEmail(email, resetPassword) {
    const html = sendInvitationEmail(email, resetPassword);
    const text = `You've been invited! Set your password: ${process.env.FRONTEND_URL}/auth/reset-password?resetPassword=${resetPassword}`;
    
    await this._sendEmail({
      to: email,
      subject: `You’re Invited to Join ${process.env.APP_NAME}`,
      html,
      text,
    });
  }

  async _sendEmail(mailOptions) {
    try {
      await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
        ...mailOptions,
      });
      console.log(`Email sent to ${mailOptions.to}`);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();
