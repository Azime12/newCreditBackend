// src/models/personModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load environment variables from the config folder
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

// Load RSA keys from the config folder
const publicKeyPath = path.resolve(__dirname, '../config/public.pem'); // Path to public key
const privateKeyPath = path.resolve(__dirname, '../config/private.pem'); // Path to private key
const passphrase = process.env.PRIVATE_KEY_PASSPHRASE; // Passphrase from .env

// Check if keys exist
if (!fs.existsSync(publicKeyPath)) { // Fixed: Added missing closing parenthesis
  throw new Error(`Public key file not found at: ${publicKeyPath}`);
}
if (!fs.existsSync(privateKeyPath)) { // Fixed: Added missing closing parenthesis
  throw new Error(`Private key file not found at: ${privateKeyPath}`);
}

// Read the keys
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Encryption function
function encryptData(data) {
  const bufferData = Buffer.from(data, 'utf-8');
  const encrypted = crypto.publicEncrypt(publicKey, bufferData);
  return encrypted.toString('base64');
}

// Decryption function
function decryptData(encryptedData) {
  const bufferEncrypted = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: passphrase, // Use the passphrase from environment variables
    },
    bufferEncrypted
  );
  return decrypted.toString('utf-8');
}

const Person = sequelize.define('Person', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    set(value) {
      // Encrypt email before saving
      this.setDataValue('email', encryptData(value));
    },
    get() {
      // Decrypt email when retrieving
      const encryptedEmail = this.getDataValue('email');
      return decryptData(encryptedEmail);
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      // Encrypt phone number before saving
      if (value) {
        this.setDataValue('phoneNumber', encryptData(value));
      }
    },
    get() {
      // Decrypt phone number when retrieving
      const encryptedPhoneNumber = this.getDataValue('phoneNumber');
      return encryptedPhoneNumber ? decryptData(encryptedPhoneNumber) : null;
    },
  },
  creditBalance: {
    type: DataTypes.DECIMAL,
    defaultValue: 0.0,
  },
  savingBalance: {
    type: DataTypes.DECIMAL,
    defaultValue: 0.0,
  },
}, {
  timestamps: true,
});

module.exports = Person;