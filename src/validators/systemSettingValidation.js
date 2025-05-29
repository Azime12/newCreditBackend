const Joi = require("joi");

exports.settingSchema = Joi.object({
  companyName: Joi.string().required(),
  brandColor: Joi.string().required(),
  logoUrl: Joi.string().uri().optional().allow(""),
  currency: Joi.string().default("USD"),
  timezone: Joi.string().default("UTC"),
  interestRate: Joi.number().min(0).optional(),
  creditLimit: Joi.number().min(0).optional(),
  minSavingAmount: Joi.number().min(0).optional(),
  allowOverdraft: Joi.boolean().optional(),
  penaltyRate: Joi.number().min(0).optional(),
  withdrawalLockDays: Joi.number().integer().min(0).optional(),
  autoApproveCredits: Joi.boolean().optional(),
});
