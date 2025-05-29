const Joi = require('joi');
const loanApplicationSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  loanTypeId: Joi.number().integer().required(),
  principalAmount: Joi.number().positive().required(),
  termMonths: Joi.number().integer().positive().required(),
  purpose: Joi.string().allow('').optional(),
  branch_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
}).options({ allowUnknown: true }); // This allows extra fields without validation

const loanApplicationUpdateSchema = Joi.object({
  principalAmount: Joi.number().positive().optional(),
  termMonths: Joi.number().integer().positive().optional(),
  purpose: Joi.string().allow('').optional(),
  branch_id: Joi.number().integer().positive().optional(),
  saving_account_id: Joi.number().integer().positive().optional()
});

// Status update schema
const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected', 'cancelled').required(),
  comments: Joi.string().allow('').optional()
});

module.exports = {
  loanApplicationSchema,
  loanApplicationUpdateSchema,
  statusUpdateSchema
};