const Joi = require("joi");

const savingAccountSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    accountNumberId: Joi.string().uuid().required(),
    balance: Joi.number().min(0).optional(),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "CLOSED").optional(),
});

module.exports = { savingAccountSchema };
