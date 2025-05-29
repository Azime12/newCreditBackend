const savingAccountService = require("../services/savingAccountService");
const { } = require("../validators/savingAccountValidation");

// Create a new saving account
const createAccount = async (req, res) => {
    try {
        const { accountNumberId, savingTypeId, balance,userId} = req.body;
        // const userId = req.user.id; // From authentication middleware
        console.log("accountnumber")
        // Validate input
        // await validateSavingAccountCreation(req.body);
        
        const newAccount = await savingAccountService.createSavingAccount({ 
            userId, 
            accountNumberId, 
            savingTypeId, 
            balance 
        });

        return res.status(201).json({
            success: true,
            data: newAccount,
            message: "Saving account created successfully"
        });
    } catch (error) {
        console.error("Error creating saving account:", error);
        const statusCode = error.message.includes("not found") ? 404 : 
                          error.message.includes("already") ? 409 : 400;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message 
        });
    }
};

const deposit = async (req, res) => {
    try {
        const { accountId, amount, userId } = req.body;

        // Validate input
        if (!accountId || !amount || isNaN(amount) || amount <= 0 || !userId) {
            return res.status(400).json({ 
                success: false,
                error: "Valid account ID, positive amount, and user ID are required" 
            });
        }

        // Call service
        const updatedAccount = await savingAccountService.deposit({ 
            accountId, 
            amount: parseFloat(amount),
            userId
        });

        // Success response
        return res.status(200).json({ 
            success: true,
            data: updatedAccount,
            message: "Deposit successful"
        });
    } catch (error) {
        console.error("Deposit error:", error);

        // Determine appropriate status code
        const statusCode = error.message.includes("not found") ? 404 : 500;

        // Error response
        return res.status(statusCode).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Deposit funds

// Withdraw funds
const withdraw = async (req, res) => {
    try {
        const { accountId, amount, userId } = req.body;
        
        // Validate input
        if (!accountId || !amount || isNaN(amount) || amount <= 0 || !userId) {
            return res.status(400).json({ 
                success: false,
                error: "Valid account ID, positive amount, and user ID are required" 
            });
        }

        // Call service
        const result = await savingAccountService.withdraw({ 
            accountId, 
            amount: parseFloat(amount),
            userId
        });
        
        // Success response
        return res.status(200).json({
            success: true,
            data: result,
            message: "Withdrawal successful"
        });
    } catch (error) {
        console.error("Withdrawal error:", error);
        
        // Determine appropriate status code
        const statusCode = 
            error.message.includes("not found") ? 404 :
            error.message.includes("Insufficient") ? 400 :
            error.message.includes("limit") ? 403 :
            error.message.includes("not active") ? 403 : 500;

        return res.status(statusCode).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Transfer funds
const transfer = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount ,userId} = req.body;
        // const userId = req.user.id;
        
        if (!fromAccountId || !toAccountId || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ 
                error: "Valid fromAccountId, toAccountId and positive amount are required" 
            });
        }

        const result = await savingAccountService.transfer({ 
            fromAccountId, 
            toAccountId, 
            amount: parseFloat(amount),
            userId
        });
        
        return res.status(200).json({ 
            success: true,
            data: result,
            message: "Transfer successful"
        });
    } catch (error) {
        console.error("Transfer error:", error);
        const statusCode = error.message.includes("not found") ? 404 : 
                          error.message.includes("Insufficient") ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get all saving accounts (admin)
const getAllAccounts = async (req, res) => {
    try {
        const filters = {};
        
        // Apply filters from query params
        if (req.query.userId) filters.userId = req.query.userId;
        if (req.query.status) filters.status = req.query.status;
        if (req.query.savingTypeId) filters.savingTypeId = req.query.savingTypeId;

        const accounts = await savingAccountService.getAllSavingAccounts(filters);

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts,
            message: 'Saving accounts retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting all accounts:', error);
        return res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

// Get user's saving accounts
const getUserAccounts = async (req, res) => {
    try {
        const userId = req.user.id;
        const accounts = await savingAccountService.getSavingAccountsByUser(userId);

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts,
            message: 'User accounts retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting user accounts:', error);
        return res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

// Get account details
const getAccountDetails = async (req, res) => {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;

        const account = await savingAccountService.getAccountById(accountId, userId);

        return res.status(200).json({
            success: true,
            data: account,
            message: 'Account details retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting account details:', error);
        const statusCode = error.message.includes("not found") ? 404 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message
        });
    }
};

// Update account status
const updateStatus = async (req, res) => {
    try {
        const { accountId, status,userId } = req.body;
        // const userId = req.user.id;

        if (!accountId || !status) {
            return res.status(400).json({ error: "Account ID and status are required" });
        }

        const account = await savingAccountService.updateAccountStatus(accountId, status, userId);

        return res.status(200).json({
            success: true,
            data: account,
            message: 'Account status updated successfully'
        });
    } catch (error) {
        console.error('Error updating account status:', error);
        const statusCode = error.message.includes("not found") ? 404 : 
                          error.message.includes("Invalid") ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message
        });
    }
};

// Calculate interest (admin)
const calculateAccountInterest = async (req, res) => {
    try {
        const { accountId } = req.params;

        if (!accountId) {
            return res.status(400).json({ error: "Account ID is required" });
        }

        const result = await savingAccountService.calculateInterest(accountId);

        return res.status(200).json({
            success: true,
            data: result,
            message: 'Interest calculated and applied successfully'
        });
    } catch (error) {
        console.error('Error calculating interest:', error);
        const statusCode = error.message.includes("not found") ? 404 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message
        });
    }
};

// Get account balance
const getBalance = async (req, res) => {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;

        const balance = await savingAccountService.getAccountBalance(accountId, userId);

        return res.status(200).json({
            success: true,
            data: { balance },
            message: 'Account balance retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting account balance:', error);
        const statusCode = error.message.includes("not found") ? 404 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message
        });
    }
};

// Get account transactions
const getTransactions = async (req, res) => {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;
        const { startDate, endDate, type, limit } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (type) filters.type = type;
        if (limit) filters.limit = parseInt(limit);

        const transactions = await savingAccountService.getAccountTransactions(
            accountId, 
            userId,
            filters
        );

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
            message: 'Account transactions retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting account transactions:', error);
        const statusCode = error.message.includes("not found") ? 404 : 500;
        return res.status(statusCode).json({ 
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createAccount,
    deposit,
    withdraw,
    transfer,
    getAllAccounts,
    getUserAccounts,
    getAccountDetails,
    updateStatus,
    calculateAccountInterest,
    getBalance,
    getTransactions
};