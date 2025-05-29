require('dotenv').config();
const crypto = require('crypto');

// Load AES Key and IV from Environment Variables
const secretKey = Buffer.from(process.env.AES_SECRET_KEY, 'hex');
const iv = Buffer.from(process.env.AES_IV, 'hex');

// Check Key and IV Lengths
if (secretKey.length !== 32 || iv.length !== 16) {
  throw new Error("Invalid AES key or IV length. Ensure AES key is 32 bytes and IV is 16 bytes.");
}

// ✅ Encrypt Data
function encryptData(data) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encryptedData = cipher.update(data, 'utf-8', 'base64');
    encryptedData += cipher.final('base64');
    return encryptedData;
  } catch (error) {
    console.error("🔴 Encryption Error:", error.message);
    throw new Error("Encryption failed");
  }
}

// ✅ Decrypt Data
function decryptData(encryptedData) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  } catch (error) {
    console.error("🔴 Decryption Error:", error.message);
    throw new Error("Decryption failed");
  }
}

module.exports = { encryptData, decryptData };
