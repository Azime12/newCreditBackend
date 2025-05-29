
const Transaction = require("../models/TransactionModel");


const createTransaction = async (userId, transactionType, amount, referenceId, balanceAfter, status, t, fromAccountId, toAccountId) => {
    try {
        // Create a new transaction
        const transaction = await Transaction.create({
            userId,
            transactionType,
            amount,
            referenceId,
            balanceAfter,
            status,
            fromAccountId, // Ensure to set fromAccountId
            toAccountId,   // Ensure to set toAccountId
        }, { transaction: t }); // Pass the transaction object for atomicity
        return transaction;
    } catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
};


const getTransactionsByUser = async (userId) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId },
        });
        return transactions;
    } catch (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};

const updateTransactionStatus = async (transactionId, status) => {
    try {
        const transaction = await Transaction.update(
            { status },
            { where: { id: transactionId } }
        );
        return transaction;
    } catch (error) {
        throw new Error(`Error updating transaction status: ${error.message}`);
    }
};

module.exports = {
    createTransaction,
    getTransactionsByUser,
    updateTransactionStatus,
};
