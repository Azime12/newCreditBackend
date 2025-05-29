const baseTemplate = require('./base-template');

module.exports = (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?verify=${verificationToken}`;
  
  return baseTemplate({
    title: 'Verify Your Email Address',
    greeting: `Welcome to ${process.env.APP_NAME}!`,
    content: `
      <p>Thank you for signing up. Please verify your email address to activate your account.</p>
      <p>This verification link will expire in 24 hours.</p>
    `,
    cta: {
      text: 'Verify Email Address',
      url: verificationUrl
    }
  });
};