const Joi = require("joi");

const userProfileSchema = Joi.object({
  address: Joi.object({
    wereda: Joi.string().min(2).max(100).optional(),
    city: Joi.string().min(2).max(50).optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    zone: Joi.string().optional(),
    poBox: Joi.string().optional(), // ✅ Added poBox in camelCase
  }).optional(),

  profilePhoto: Joi.string().optional(),
  idType: Joi.string(),
   
  idNumber: Joi.string().min(5).max(20).optional().messages({
    "string.min": "ID number must be at least 5 characters",
    "string.max": "ID number must be at most 20 characters",
  }),
  idFrontPhoto: Joi.string().optional(),
  idBackPhoto: Joi.string().optional(),
  identityVerified: Joi.boolean().optional(),
  dateOfBirth: Joi.date().iso().optional().messages({
    "date.format": "Date of birth must be in YYYY-MM-DD format",
  }),
});

module.exports = {
  userProfileSchema,
};
