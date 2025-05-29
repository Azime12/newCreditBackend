const SavingAccount = require("../models/SavingsAccountModel");
const SavingType = require("../models/SavingTypeModel");
const AccountNumber = require("../models/AccountNumberModel");
const SavingInterest = require("../models/savingIterestModel");
const Transaction = require("../models/TransactionModel");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// Create a new saving account with validation
const createSavingAccount = async ({ userId, accountNumberId, savingTypeId, balance }) => {
    const t = await sequelize.transaction();
    try {
        // Validate account number exists and belongs to the user
        const accountNumber = await AccountNumber.findOne({
            where: { id: accountNumberId, userId },
            transaction: t
        });
        
        if (!accountNumber) {
            throw new Error("Account number not found or doesn't belong to user");
        }

        // Check if account number is already used
        const accountWithNumber = await SavingAccount.findOne({
            where: { accountNumberId },
            transaction: t
        });
        
        if (accountWithNumber) {
            throw new Error("Account number is already assigned to another account");
        }

        // Validate saving type exists
        const savingType = await SavingType.findByPk(savingTypeId, { transaction: t });
        if (!savingType) {
            throw new Error("Invalid saving type");
        }

        // Check if user already has this saving type
        const existingAccount = await SavingAccount.findOne({
            where: { userId, savingTypeId },
            transaction: t
        });
        
        if (existingAccount) {
            throw new Error("User already has an account of this saving type");
        }

        // Validate minimum balance
        const initialBalance = balance || savingType.minBalance;
        if (initialBalance < savingType.minBalance) {
            throw new Error(`Minimum balance required is ${savingType.minBalance}`);
        }

        // Create the account
        const newAccount = await SavingAccount.create({
            userId,
            accountNumberId,
            savingTypeId,
            balance: initialBalance,
            status: "ACTIVE"
        }, { transaction: t });

        await t.commit();
        return newAccount;
    } catch (error) {
        await t.rollback();
        throw new Error(`Error creating saving account: ${error.message}`);
    }
};

const deposit = async ({ accountId, amount, userId }) => {
    const t = await sequelize.transaction();
    try {
        // 1. First, lock the account without including associations
        const account = await SavingAccount.findOne({
            where: { id: accountId, userId },
            lock: true,  // Applies FOR UPDATE to this row only
            transaction: t
        });

        if (!account) {
            throw new Error("Account not found or doesn't belong to user");
        }

        // 2. If you need SavingType, fetch it in a separate query (without locking)
        const savingType = await SavingType.findOne({
            where: { id: account.savingTypeId },
            transaction: t
        });

        // 3. Calculate new balance
        const newBalance = parseFloat(account.balance) + parseFloat(amount);

        // 4. Create transaction record
        await Transaction.create({
            userId,
            transactionType: "DEPOSIT",
            amount,
            fromAccountId: null,
            toAccountId: accountId,
            status: "COMPLETED",
            transactionDate: new Date()
        }, { transaction: t });

        // 5. Update account balance
        await account.update({ balance: newBalance }, { transaction: t });

        await t.commit();
        
        // Return account with populated data if needed
        return { ...account.get(), savingType };
    } catch (error) {
        await t.rollback();
        throw new Error(`Deposit failed: ${error.message}`);
    }
};
// Withdraw funds from account
const withdraw = async ({ accountId, amount, userId }) => {
    const t = await sequelize.transaction();
    try {
        // 1. First, lock the account without including associations
        const account = await SavingAccount.findOne({
            where: { id: accountId, userId },
            lock: true,  // FOR UPDATE lock
            transaction: t
        });

        if (!account) {
            throw new Error("Account not found or doesn't belong to user");
        }

        // 2. Fetch SavingType separately if needed
        const savingType = await SavingType.findOne({
            where: { id: account.savingTypeId },
            transaction: t
        });

        // 3. Check account status
        if (account.status !== "ACTIVE") {
            throw new Error("Account is not active for withdrawals");
        }

        // 4. Check sufficient balance
        if (parseFloat(account.balance) < parseFloat(amount)) {
            throw new Error("Insufficient funds for withdrawal");
        }

        // 5. Check withdrawal limit if applicable
        if (savingType?.withdrawalLimit !== null) {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            
            const withdrawalsThisMonth = await Transaction.count({
                where: {
                    fromAccountId: accountId,
                    transactionType: "WITHDRAWAL",
                    status: "COMPLETED",
                    createdAt: { [Op.gte]: startOfMonth }
                },
                transaction: t
            });
            
            if (withdrawalsThisMonth >= savingType.withdrawalLimit) {
                throw new Error(`Withdrawal limit of ${savingType.withdrawalLimit} per month reached`);
            }
        }

        // 6. Calculate new balance
        const newBalance = parseFloat(account.balance) - parseFloat(amount);

        // 7. Create transaction record
        await Transaction.create({
            userId,
            transactionType: "WITHDRAWAL",
            amount,
            fromAccountId: accountId,
            toAccountId: null,
            status: "COMPLETED",
            transactionDate: new Date()
        }, { transaction: t });

        // 8. Update account balance
        await account.update({ balance: newBalance }, { transaction: t });

        await t.commit();
        return account;
    } catch (error) {
        await t.rollback();
        throw new Error(`Withdrawal failed: ${error.message}`);
    }
};

// Transfer funds between accounts
const transfer = async ({ fromAccountId, toAccountId, amount, userId }) => {
    const t = await sequelize.transaction();
    try {
        // Validate sender account exists and belongs to user
        const fromAccount = await SavingAccount.findOne({
            where: { id: fromAccountId, userId },
            lock: true,
            transaction: t
        });
        
        if (!fromAccount) {
            throw new Error("Sender account not found or doesn't belong to user");
        }

        // Check if sender account is active
        if (fromAccount.status !== "ACTIVE") {
            throw new Error("Sender account is not active for transactions");
        }

        // Validate recipient account exists
        const toAccount = await SavingAccount.findByPk(toAccountId, { 
            lock: true,
            transaction: t 
        });
        
        if (!toAccount) {
            throw new Error("Recipient account not found");
        }

        // Check sufficient balance
        if (fromAccount.balance < amount) {
            throw new Error("Insufficient funds for transfer");
        }

        const newFromBalance = fromAccount.balance - amount;
        const newToBalance = toAccount.balance + amount;

        // Create transaction record
        const transactionRecord = await Transaction.create({
            userId,
            transactionType: "TRANSFER",
            amount,
            fromAccountId,
            toAccountId,
            status: "COMPLETED",
            transactionDate: new Date()
        }, { transaction: t });

        // Update both accounts
        await fromAccount.update({ balance: newFromBalance }, { transaction: t });
        await toAccount.update({ balance: newToBalance }, { transaction: t });

        await t.commit();
        return { fromAccount, toAccount };
    } catch (error) {
        await t.rollback();
        throw new Error(`Transfer failed: ${error.message}`);
    }
};

// Get all saving accounts with details
const getAllSavingAccounts = async (filters = {}) => {
    try {
        const whereClause = {};
        
        // Apply filters if provided
        if (filters.userId) whereClause.userId = filters.userId;
        if (filters.status) whereClause.status = filters.status;
        if (filters.savingTypeId) whereClause.savingTypeId = filters.savingTypeId;

        const accounts = await SavingAccount.findAll({
            where: whereClause,
            include: [
                {
                    model: SavingType,
                    attributes: ['id', 'name', 'interestRate', 'minBalance', 'withdrawalLimit', 'penaltyRate']
                },
                {
                    model: AccountNumber,
                    attributes: ['id', 'accountNumber']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return accounts;
    } catch (error) {
        throw new Error(`Error fetching saving accounts: ${error.message}`);
    }
};

// Get saving accounts by user ID
const getSavingAccountsByUser = async (userId) => {
    try {
        const accounts = await SavingAccount.findAll({
            where: { userId },
            include: [
                {
                    model: SavingType,
                    attributes: ['id', 'name', 'interestRate', 'description']
                },
                {
                    model: AccountNumber,
                    attributes: ['id', 'accountNumber']
                }
            ],
            attributes: ['id', 'balance', 'status', 'createdAt']
        });

        return accounts;
    } catch (error) {
        throw new Error(`Error fetching user saving accounts: ${error.message}`);
    }
};

// Get account by ID with details
const getAccountById = async (accountId, userId = null) => {
    try {
        const whereClause = { id: accountId };
        if (userId) whereClause.userId = userId;

        const account = await SavingAccount.findOne({
            where: whereClause,
            include: [
                {
                    model: SavingType,
                    attributes: ['id', 'name', 'interestRate', 'minBalance', 'withdrawalLimit']
                },
                {
                    model: AccountNumber,
                    attributes: ['id', 'accountNumber']
                }
            ]
        });

        if (!account) {
            throw new Error("Account not found");
        }

        return account;
    } catch (error) {
        throw new Error(`Error fetching account: ${error.message}`);
    }
};

// Update account status
const updateAccountStatus = async (accountId, status, userId = null) => {
    const t = await sequelize.transaction();
    try {
        const whereClause = { id: accountId };
        if (userId) whereClause.userId = userId;

        const account = await SavingAccount.findOne({
            where: whereClause,
            transaction: t
        });

        if (!account) {
            throw new Error("Account not found");
        }

        // Validate status transition
        const validTransitions = {
            "ACTIVE": ["INACTIVE", "CLOSED"],
            "INACTIVE": ["ACTIVE", "CLOSED"],
            "CLOSED": [] // Cannot reopen closed accounts
        };

        if (!validTransitions[account.status]?.includes(status)) {
            throw new Error(`Invalid status transition from ${account.status} to ${status}`);
        }

        // Special handling for closing accounts
        if (status === "CLOSED" && account.balance > 0) {
            throw new Error("Cannot close account with positive balance");
        }

        await account.update({ status }, { transaction: t });

        await t.commit();
        return account;
    } catch (error) {
        await t.rollback();
        throw new Error(`Error updating account status: ${error.message}`);
    }
};

// Calculate and add interest to account
const calculateInterest = async (accountId) => {
    const t = await sequelize.transaction();
    try {
        const account = await SavingAccount.findOne({
            where: { id: accountId },
            include: [SavingType],
            lock: true,
            transaction: t
        });

        if (!account) {
            throw new Error("Account not found");
        }

        if (account.status !== "ACTIVE") {
            throw new Error("Interest can only be calculated for active accounts");
        }

        // Calculate interest based on account type
        const interest = (account.balance * account.SavingType.interestRate) / 100;
        const newBalance = account.balance + interest;

        // Record interest transaction
        await SavingInterest.create({
            savingAccountId: accountId,
            interestEarned: interest,
            calculationDate: new Date()
        }, { transaction: t });

        // Update account balance
        await account.update({ balance: newBalance }, { transaction: t });

        await t.commit();
        return { account, interest };
    } catch (error) {
        await t.rollback();
        throw new Error(`Error calculating interest: ${error.message}`);
    }
};

// Get account balance
const getAccountBalance = async (accountId, userId = null) => {
    try {
        const whereClause = { id: accountId };
        if (userId) whereClause.userId = userId;

        const account = await SavingAccount.findOne({
            where: whereClause,
            attributes: ['balance']
        });

        if (!account) {
            throw new Error("Account not found");
        }

        return account.balance;
    } catch (error) {
        throw new Error(`Error fetching account balance: ${error.message}`);
    }
};

// Get account transactions
const getAccountTransactions = async (accountId, userId = null, filters = {}) => {
    try {
        // Verify account exists and belongs to user if userId provided
        if (userId) {
            const accountExists = await SavingAccount.findOne({
                where: { id: accountId, userId },
                attributes: ['id']
            });
            if (!accountExists) {
                throw new Error("Account not found or doesn't belong to user");
            }
        }

        const whereClause = {
            [Op.or]: [
                { fromAccountId: accountId },
                { toAccountId: accountId }
            ]
        };

        // Apply filters
        if (filters.startDate) {
            whereClause.createdAt = { [Op.gte]: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: new Date(filters.endDate) };
        }
        if (filters.type) {
            whereClause.transactionType = filters.type;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: filters.limit || 100
        });

        return transactions;
    } catch (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};

module.exports = {
    createSavingAccount,
    deposit,
    withdraw,
    transfer,
    getAllSavingAccounts,
    getSavingAccountsByUser,
    getAccountById,
    updateAccountStatus,
    calculateInterest,
    getAccountBalance,
    getAccountTransactions
};