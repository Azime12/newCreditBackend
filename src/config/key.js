const crypto = require('crypto');

// Generate a 32-byte AES Key (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex'); // 64 characters

// Generate a 16-byte IV (128 bits)
const iv = crypto.randomBytes(16).toString('hex'); // 32 characters

console.log("🔑 AES Secret Key:", secretKey);
console.log("🔑 AES IV:", iv);
