const transactionService = require("../services/transactionService");

const createTransaction = async (req, res) => {
    const { userId, transactionType, amount, referenceId, balanceAfter, status } = req.body;

    try {
        const transaction = await transactionService.createTransaction(
            userId,
            transactionType,
            amount,
            referenceId,
            balanceAfter,
            status
        );
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransactionsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await transactionService.getTransactionsByUser(userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransactionStatus = async (req, res) => {
    const { transactionId } = req.params;
    const { status } = req.body;

    try {
        const transaction = await transactionService.updateTransactionStatus(transactionId, status);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransaction,
    getTransactionsByUser,
    updateTransactionStatus,
};
