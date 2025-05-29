const Joi = require('joi');
const { LoanPayment } = require('../models/loan');

const paymentMethods = Object.values(LoanPayment.rawAttributes.method.values);
const paymentStatuses = Object.values(LoanPayment.rawAttributes.status.values);

// Export individual schemas instead of nested objects
module.exports = {
verifyPaymentSchema: Joi.object({
    action: Joi.string().valid('approve', 'reject').required(),
    reason: Joi.string().when('action', {
      is: 'reject',
      then: Joi.string().required(),
      otherwise: Joi.string().optional()
    })
  }).options({ abortEarly: false }),

  createPaymentSchema: Joi.object({
    loanId: Joi.number().integer().required(),
    amount: Joi.number().positive().precision(2).required(),
    principalAmount: Joi.number().positive().precision(2).required(),
    interestAmount: Joi.number().min(0).precision(2).required(),
    paymentDate: Joi.date().iso().required(),
    method: Joi.string().valid(...paymentMethods).required(),
    reference: Joi.string().max(100).trim(),
    notes: Joi.string().max(500).trim()
  }).options({ abortEarly: false }),

  updatePaymentSchema: Joi.object({
    amount: Joi.number().positive().precision(2),
    principalAmount: Joi.number().positive().precision(2),
    interestAmount: Joi.number().min(0).precision(2),
    paymentDate: Joi.date().iso(),
    method: Joi.string().valid(...paymentMethods),
    reference: Joi.string().max(100).trim(),
    notes: Joi.string().max(500).trim(),
    status: Joi.string().valid(...paymentStatuses)
  }).options({ abortEarly: false }),

  paymentIdSchema: Joi.object({
    paymentId: Joi.number().integer().required()
  }).options({ abortEarly: false }),

  getPaymentsSchema: Joi.object({
    loanId: Joi.number().integer(),
    status: Joi.string().valid(...paymentStatuses),
    method: Joi.string().valid(...paymentMethods),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }).options({ abortEarly: false }),

  
  reversePaymentSchema: Joi.object({
    reversalReason: Joi.string().max(500).required()
  }).options({ abortEarly: false })
};