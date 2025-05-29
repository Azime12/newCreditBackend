const Joi = require("joi");

const validateDeposit = (data) => {
    const schema = Joi.object({
        accountId: Joi.string().required(),
        amount: Joi.number().positive().precision(2).required()
    });
    return schema.validate(data);
};

const validateWithdraw = (data) => {
    const schema = Joi.object({
        accountId: Joi.string().required(),
        amount: Joi.number().positive().precision(2).required()
    });
    return schema.validate(data);
};

const validateTransfer = (data) => {
    const schema = Joi.object({
        fromAccountId: Joi.string().required(),
        toAccountId: Joi.string().required(),
        amount: Joi.number().positive().precision(2).required()
    });
    return schema.validate(data);
};

module.exports = {
    validateDeposit,
    validateWithdraw,
    validateTransfer
};