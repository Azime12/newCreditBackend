const Joi = require('joi');
const { PaymentFrequency } = require('../constants/enums');

const namePattern = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDFa-zA-Z0-9\s\-]+$/;

const createLoanTypeSchema = Joi.object({
  name: Joi.string().max(100).required()
    .regex(namePattern)
    .messages({
      'string.pattern.base': 'Name can only contain Amharic or English letters, numbers, spaces, and hyphens',
      'any.required': 'Name is required',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  description: Joi.string().max(500).allow('').optional(),
  interest_rate: Joi.number().min(0).max(100).precision(2).required()
    .messages({
      'number.base': 'Interest rate must be a number',
      'number.min': 'Interest rate cannot be negative',
      'number.max': 'Interest rate cannot exceed 100%',
      'number.precision': 'Interest rate can have maximum 2 decimal places'
    }),
  min_term: Joi.number().integer().min(1).max(1200).required()
    .messages({
      'number.base': 'Minimum term must be a number',
      'number.integer': 'Minimum term must be an integer',
      'number.min': 'Minimum term must be at least 1 month',
      'number.max': 'Maximum term cannot exceed 100 years (1200 months)'
    }),
  max_term: Joi.number().integer().min(Joi.ref('min_term')).max(1200).required()
    .messages({
      'number.base': 'Maximum term must be a number',
      'number.integer': 'Maximum term must be an integer',
      'number.min': 'Maximum term must be greater than or equal to minimum term',
      'number.max': 'Maximum term cannot exceed 100 years (1200 months)'
    }),
  payment_frequency: Joi.string().valid(...Object.values(PaymentFrequency)).required()
    .messages({
      'any.only': `Payment frequency must be one of: ${Object.values(PaymentFrequency).join(', ')}`
    }),
  min_amount: Joi.number().min(0).precision(2).max(100000000).required()
    .messages({
      'number.base': 'Minimum amount must be a number',
      'number.min': 'Minimum amount cannot be negative',
      'number.precision': 'Amount can have maximum 2 decimal places',
      'number.max': 'Amount cannot exceed 100,000,000'
    }),
  max_amount: Joi.number().min(Joi.ref('min_amount')).precision(2).max(100000000).required()
    .messages({
      'number.base': 'Maximum amount must be a number',
      'number.min': 'Maximum amount must be greater than or equal to minimum amount',
      'number.precision': 'Amount can have maximum 2 decimal places',
      'number.max': 'Amount cannot exceed 100,000,000'
    }),
  grace_period_days: Joi.number().integer().min(0).max(30).default(0),
  late_payment_fee: Joi.number().min(0).precision(2).default(0),
  early_repayment_allowed: Joi.boolean().default(true),
  requires_collateral: Joi.boolean().default(false),
  collateral_coverage_ratio: Joi.when('requires_collateral', {
    is: true,
    then: Joi.number().min(1).max(5).default(1.5),
    otherwise: Joi.optional()
  }),
  is_active: Joi.boolean().default(true)
}).options({ abortEarly: false });

const updateLoanTypeSchema = Joi.object({
  name: Joi.string().max(100)
    .regex(namePattern)
    .messages({
      'string.pattern.base': 'Name can only contain Amharic or English letters, numbers, spaces, and hyphens',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  description: Joi.string().max(500).allow(''),
  interest_rate: Joi.number().min(0).max(100).precision(2),
  min_term: Joi.number().integer().min(1).max(1200),
  max_term: Joi.number().integer().min(Joi.ref('min_term')).max(1200),
  payment_frequency: Joi.string().valid(...Object.values(PaymentFrequency)),
  min_amount: Joi.number().min(0).precision(2).max(100000000),
  max_amount: Joi.number().min(Joi.ref('min_amount')).precision(2).max(100000000),
  grace_period_days: Joi.number().integer().min(0).max(30),
  late_payment_fee: Joi.number().min(0).precision(2),
  early_repayment_allowed: Joi.boolean(),
  requires_collateral: Joi.boolean(),
  collateral_coverage_ratio: Joi.when('requires_collateral', {
    is: true,
    then: Joi.number().min(1).max(5),
    otherwise: Joi.optional()
  }),
  is_active: Joi.boolean()
}).min(1).options({ abortEarly: false });

module.exports = {
  createLoanTypeSchema,
  updateLoanTypeSchema
};