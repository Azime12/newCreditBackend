const { Sequelize } = require("sequelize");
const SavingInterest = require("../models/savingIterestModel");
const SavingAccount = require("../models/SavingsAccountModel");
const SavingType=require("../models/SavingTypeModel");
const sequelize = require("../config/database");

const TransactionService = require("../services/transactionService");

const addInterestToAccount = async (savingAccountId) => {
    const t = await sequelize.transaction(); // Start a new transaction
    try {
        // Retrieve the saving account
        const savingAccount = await SavingAccount.findByPk(savingAccountId, { transaction: t });
        if (!savingAccount) {
            throw new Error("Saving account not found");
        }

        // Get the interest rate from the associated saving type
        const savingType = await SavingType.findByPk(savingAccount.savingTypeId, { transaction: t });
        if (!savingType || isNaN(savingType.interestRate)) {
            throw new Error("Interest rate not found for saving type.");
        }

        // Calculate the interest earned
        const balance = parseFloat(savingAccount.balance);
        if (isNaN(balance)) {
            throw new Error("Invalid balance format.");
        }
        const interestEarned = (balance * savingType.interestRate) / 100;
        const roundedInterest = parseFloat(interestEarned.toFixed(2));

        // Record the interest in the saving_interest table
        await SavingInterest.create({
            savingAccountId,
            interestEarned: roundedInterest,
        }, { transaction: t });

        // Create a transaction record for the interest addition
        await TransactionService.createTransaction(
            savingAccount.userId,
            "interest",
            roundedInterest,
            savingAccountId,
            roundedInterest,
            "COMPLETED",
            t
        );

        // Update the saving account balance
        savingAccount.balance = Sequelize.literal(`balance + ${roundedInterest}`);
        await savingAccount.save({ transaction: t });

        await t.commit(); // Commit the transaction
        return { interestEarned: roundedInterest };
    } catch (error) {
        await t.rollback(); // Rollback the transaction in case of error
        throw new Error(`Failed to add interest: ${error.message}`);
    }
};



/**
 * Get all interests for a specific saving account
 */
const getInterestsByAccount = async (savingAccountId) => {
    return await SavingInterest.findAll({ where: { savingAccountId } });
};

/**
 * Get all interest records
 */
const getAllInterests = async () => {
    return await SavingInterest.findAll();
};

module.exports = {
    addInterestToAccount,
    getInterestsByAccount,
    getAllInterests,
};
