const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// Convert UUID to a numeric format
const generateNumericUUID = (userUUID) => {
    const uuid = userUUID.replace(/-/g, '');
    return BigInt('0x' + uuid).toString().slice(0, 6); // Take first 6 digits
};

// Function to generate a unique account number (10-13 digits)
const generateAccountNumber = async (userUUID = uuidv4(), prefix = "181") => {
    const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
    const uniqueId = generateNumericUUID(userUUID); // 6-digit numeric UUID

    let uniqueSuffix = crypto.randomInt(100, 9999); // 3 to 4-digit random number

    let accountNumber = `${prefix}${year}${uniqueId}${uniqueSuffix}`;

    // Ensure length is between 10 and 13 digits
    if (accountNumber.length < 10) {
        accountNumber += crypto.randomInt(1, 9); // Append a random single digit if too short
    } else if (accountNumber.length > 13) {
        accountNumber = accountNumber.slice(0, 13); // Trim if too long
    }

    return accountNumber;
};

// ✅ Export function
module.exports = {
    generateAccountNumber,
};
