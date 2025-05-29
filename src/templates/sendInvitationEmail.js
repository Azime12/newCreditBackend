const baseTemplate = require('./base-template');

module.exports = (email, resetToken) => {
  const invitationUrl = `${process.env.FRONTEND_URL}/auth/reset-password?resetPassword=${resetToken}`;

  return baseTemplate({
    title: 'You’re Invited!',
    greeting: `Hi there,`,
    content: `
      <p>You’ve been invited to join <strong>${process.env.APP_NAME}</strong>.</p>
      <p>Please click the button below to set your password and activate your account.</p>
      <p>This link will expire in 1 hour. If you did not expect this invitation, you can ignore this email.</p>
    `,
    cta: {
      text: 'Set Your Password',
      url: invitationUrl,
    },
  });
};
