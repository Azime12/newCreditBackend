// utils/googleAuthClient.js
const { OAuth2Client } = require('google-auth-library');

// Google OAuth2 Client for verifying tokens
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = { client };
