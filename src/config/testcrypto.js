const { encryptData, decryptData } = require('../utils/cryptoUtils');

// Example Data
const originalData = "admin@example.com";
console.log("🔵 Original Data:", originalData);

// Encrypt
const encrypted = encryptData(originalData);
console.log("🟢 Encrypted Data:", encrypted);

// Decrypt
const decrypted = decryptData("83ik4oOX/mMweDTuD97gIhduoY1CHxemezta+jv8z4X+IhoXH7QzZV/SZpz6eb/3");
console.log("🟡 Decrypted Data:", decrypted);
