
const AccountNumber = require("../models/AccountNumberModel");
const User = require("../models/userModel"); // Ensure the correct path to User model

/**
 * Create a new account number for a user
 */
const createAccountNumber = async (userId, accountNumber) => {
    // 🔹 Check if the user exists
    const userExists = await User.findOne({ where: { id: userId } });

    if (!userExists) {
        throw new Error("Invalid user ID. User does not exist.");
    }

    // 🔹 Check if the account number already exists
    const existingAccount = await AccountNumber.findOne({
        where: { accountNumber },
    });

    if (existingAccount) {
        throw new Error("Account number already exists.");
    }

    // ✅ Create a new account number if validations pass
    return await AccountNumber.create({ userId, accountNumber });
};

/**
 * Get account numbers by user ID
 */
const getAccountNumbersByUser = async (userId) => {
    return await AccountNumber.findAll({ where: { userId } });
};

/**
 * Get a single account number by ID
 */
const getAccountNumberById = async (id) => {
    console.log("Fetching account by ID:", id);
    
    const account = await AccountNumber.findOne({
        where: { id },
    });

    if (!account) {
        console.log("No account found for ID:", id);
    }

    return account;
};


/**
 * Delete an account number
 */
const deleteAccountNumber = async (id) => {
    console.log("id",id)
    return await AccountNumber.destroy({ where: { id } });
};

module.exports = {
    createAccountNumber,
    getAccountNumbersByUser,
    getAccountNumberById,
    deleteAccountNumber,
};
