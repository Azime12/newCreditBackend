const Joi = require("joi");

const accountNumberSchema = Joi.object({
    userId: Joi.string().uuid().required().messages({
        "string.empty": "User ID is required.",
        "string.uuid": "Invalid User ID format.",
    }), 
    accountNumber: Joi.string()
        .pattern(/^\d+$/)
        .optional()
        .messages({
            "string.pattern.base": "Account Number must be numeric.",
        }),
    autoGenerate: Joi.boolean().required().messages({
        "boolean.base": "autoGenerate must be a boolean.",
    }),
});

module.exports = { accountNumberSchema };
