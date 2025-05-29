const accountNumberService = require("../services/accountNumberService");
const { generateAccountNumber } = require("../utils/generateAccountNumber");
const { accountNumberSchema } = require("../validators/accountNumberValidator");

/**
 * Create a new account number
 */
const createAccountNumber = async (req, res) => {
    try {
        // Validate input data
        if (req.body.accountNumber === '') {
            delete req.body.accountNumber;  
          }
          
        const { error } = accountNumberSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let creAccountNumber = "";
        const { userId, accountNumber, autoGenerate } = req.body;

        // Generate account number if autoGenerate is true
        if (autoGenerate) {
            creAccountNumber = await generateAccountNumber(userId);
        } else {
            creAccountNumber = accountNumber;
        }

        // Ensure account number is valid   
        if (!creAccountNumber) {
            return res.status(400).json({ message: "Something went wrong. Please try again with a correct account number." });
        }
       // Create the new account number
        const newAccountNumber = await accountNumberService.createAccountNumber(userId, creAccountNumber);
         res.status(201).json({
            sucess:true,
            message: "Account number created successfully.",
            accountNumber: newAccountNumber,
        });
    } catch (error) {
        console.error("Error creating account number:", error);
        res.status(500).json({ message: "Error creating account number", error: error.message });
    }
};





/**
 * Get all account numbers for a user
 */
const getAccountNumbersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const accounts = await accountNumberService.getAccountNumbersByUser(userId);
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving account numbers", error: error.message });
    }
};

/**
 * Get a single account number by ID
 */
const getAccountNumberById = async (req, res) => {
    try {
        const { accountId } = req.params;
        console.log("Requested Account ID:", accountId);

        if (!accountId) {
            return res.status(400).json({ message: "Account ID is required." });
        }

        const account = await accountNumberService.getAccountNumberById(accountId);

        if (!account) {
            return res.status(404).json({ message: "Account number not found" });
        }

        res.status(200).json(account);
    } catch (error) {
        console.error("Error retrieving account number:", error);
        res.status(500).json({ message: "Error retrieving account number", error: error.message });
    }
};


/**
 * Delete an account number
 */
const deleteAccountNumber = async (req, res) => {
    try {
        const { accountId } = req.params;
        const deleted = await accountNumberService.deleteAccountNumber(accountId);

        if (!deleted) {
            return res.status(404).json({ message: "Account number not found" });
        }

        res.status(200).json({ message: "Account number deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting account number", error: error.message });
    }
};

module.exports = {
    createAccountNumber,
    getAccountNumbersByUser,
    getAccountNumberById,
    deleteAccountNumber,
};
