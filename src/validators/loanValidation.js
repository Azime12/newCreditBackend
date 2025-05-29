const Joi = require('joi');

// Base loan schema
const loanSchema = Joi.object({
  customerId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Customer ID must be a valid UUID',
      'any.required': 'Customer ID is required'
    }),
  loanTypeId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Loan type ID must be a number',
      'any.required': 'Loan type ID is required'
    }),
  applicationId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Application ID must be a number'
    }),
  principalAmount: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'Principal amount must be a number',
      'number.positive': 'Principal amount must be positive',
      'any.required': 'Principal amount is required'
    }),
  interestRate: Joi.number().positive().precision(2).max(100).required()
    .messages({
      'number.base': 'Interest rate must be a number',
      'number.positive': 'Interest rate must be positive',
      'number.max': 'Interest rate cannot exceed 100%',
      'any.required': 'Interest rate is required'
    }),
  termMonths: Joi.number().integer().positive().max(360).required()
    .messages({
      'number.base': 'Term must be a number',
      'number.integer': 'Term must be in whole months',
      'number.positive': 'Term must be positive',
      'number.max': 'Term cannot exceed 360 months',
      'any.required': 'Term is required'
    }),
  disbursementDate: Joi.date().required()
    .messages({
      'date.base': 'Disbursement date must be a valid date',
      'any.required': 'Disbursement date is required'
    }),
  dueDate: Joi.date().greater(Joi.ref('disbursementDate')).required()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.greater': 'Due date must be after disbursement date',
      'any.required': 'Due date is required'
    }),
  status: Joi.string().valid('pending', 'active', 'paid', 'defaulted', 'cancelled').optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid loan status'
    }),
  comments: Joi.string().optional()
    .messages({
      'string.base': 'Comments must be a string'
    })
});

// Update loan schema (more restrictive)
const loanUpdateSchema = loanSchema.keys({
  customerId: Joi.forbidden().messages({
    'any.unknown': 'Cannot update customer ID'
  }),
  loanTypeId: Joi.forbidden().messages({
    'any.unknown': 'Cannot update loan type ID'
  }),
  applicationId: Joi.forbidden().messages({
    'any.unknown': 'Cannot update application ID'
  }),
  principalAmount: Joi.number().positive().precision(2).optional()
    .messages({
      'number.base': 'Principal amount must be a number',
      'number.positive': 'Principal amount must be positive'
    }),
  interestRate: Joi.number().positive().precision(2).max(100).optional()
    .messages({
      'number.base': 'Interest rate must be a number',
      'number.positive': 'Interest rate must be positive',
      'number.max': 'Interest rate cannot exceed 100%'
    })
});

// Status update schema
const loanStatusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'active', 'paid', 'defaulted', 'cancelled').required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid loan status',
      'any.required': 'Status is required'
    }),
  comments: Joi.string().optional()
    .messages({
      'string.base': 'Comments must be a string'
    })
});

module.exports = {
  loanSchema,
  loanUpdateSchema,
  loanStatusUpdateSchema
};