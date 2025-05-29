const baseTemplate = require('./base-template');

module.exports = (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?resetPassword=${resetToken}`;
  
  return baseTemplate({
    title: 'Password Reset Request',
    greeting: `Hello,`,
    content: `
      <p>We received a request to reset your password for Email address .</p>
      <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
    `,
    cta: {
      text: 'Reset Password',
      url: resetUrl
    }
  });
};