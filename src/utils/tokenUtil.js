const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

const generateToken = (payload, expiresIn = "30d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
