const Joi = require("joi");

const savingTypeSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Name is required",
    "string.max": "Name must be at most 100 characters long",
  }),
  description: Joi.string().trim().allow(null, "").messages({
    "string.base": "Description must be a string",
  }),
  interestRate: Joi.number().precision(2).positive().required().messages({
    "number.base": "Interest rate must be a number",
    "number.positive": "Interest rate must be a positive number",
    "any.required": "Interest rate is required",
  }),
  minBalance: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Minimum balance must be a number",
    "number.min": "Minimum balance cannot be negative",
    "any.required": "Minimum balance is required",
  }),
  withdrawalLimit: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Withdrawal limit must be an integer",
    "number.min": "Withdrawal limit cannot be negative",
  }),
  tenureInMonths: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Tenure in months must be an integer",
    "number.min": "Tenure in months cannot be negative",
  }),
  penaltyRate: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Penalty rate must be a number",
    "number.min": "Penalty rate cannot be negative",
    "any.required": "Penalty rate is required",
  }),
});

module.exports = { savingTypeSchema };
