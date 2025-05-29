const savingInterestService = require("../services/savingInterestService");

/**
 * Controller to add interest to a saving account
 */
const addInterest = async (req, res) => {
    try {
        const { savingAccountId, interestRate } = req.body;
        const interest = await savingInterestService.addInterestToAccount(savingAccountId, interestRate);
        res.status(201).json({ message: "Interest added successfully", interest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Controller to get all interest records for a saving account
 */
const getInterestsByAccount = async (req, res) => {
    try {
        const { savingAccountId } = req.params;
        const interests = await savingInterestService.getInterestsByAccount(savingAccountId);
        res.status(200).json(interests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Controller to get all interest records
 */
const getAllInterests = async (req, res) => {
    try {
        const interests = await savingInterestService.getAllInterests();
        res.status(200).json(interests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addInterest,
    getInterestsByAccount,
    getAllInterests,
};
