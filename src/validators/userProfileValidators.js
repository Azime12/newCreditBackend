const Joi = require("joi");

// Common validation patterns
const commonValidations = {
  string: {
    min: 2,
    max: 100,
    required: '{{#label}} is required',
    empty: '{{#label}} cannot be empty'
  },
  idNumber: {
    min: 5,
    max: 20
  },
  dateFormat: 'YYYY-MM-DD'
};

// Address validation schema
const addressSchema = Joi.object({
  street: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Street must be at least {#limit} characters long',
      'string.max': 'Street cannot exceed {#limit} characters'
    }),
  city: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'City must be at least {#limit} characters long',
      'string.max': 'City cannot exceed {#limit} characters'
    }),
  state: Joi.string()
    .max(50)
    .optional(),
  country: Joi.string()
    .max(50)
    .optional(),
  zipCode: Joi.string()
    .pattern(/^[0-9]+$/)
    .max(10)
    .optional()
    .messages({
      'string.pattern.base': 'Zip code must contain only numbers'
    }),
  poBox: Joi.string()
    .max(20)
    .optional()
    .allow(null, '')
}).required(); // Changed to required() since you want it to be mandatory

// Base profile schema with common rules
const baseProfileSchema = {
 
  profilePhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile photo must be a valid URL'
    }),
  idFrontPhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'ID front photo must be a valid URL'
    }),
  idBackPhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'ID back photo must be a valid URL'
    }),
  dateOfBirth: Joi.date()
    .iso()
    .max('now')
    .messages({
      'date.format': `Date of birth must be in ${commonValidations.dateFormat} format`,
      'date.max': 'Date of birth cannot be in the future'
    })
};

// Create profile schema (with required fields)
const userProfileSchema = Joi.object({
  ...baseProfileSchema,
  idType: Joi.string()
    .valid('National ID', 'Passport', 'Kebele ID')
    .required()
    .messages({
      'any.only': 'ID Type must be one of: National ID, Passport, Kebele ID',
      'any.required': 'ID Type is required'
    }),
  idNumber: Joi.string()
    .min(commonValidations.idNumber.min)
    .max(commonValidations.idNumber.max)
    .required()
    .messages({
      'string.min': `ID number must be at least ${commonValidations.idNumber.min} characters`,
      'string.max': `ID number cannot exceed ${commonValidations.idNumber.max} characters`,
      'any.required': 'ID Number is required'
    }),
  dateOfBirth: baseProfileSchema.dateOfBirth.required()
}).options({ 
  abortEarly: false, 
  stripUnknown: true 
});

// Update profile schema (all fields optional)
const updateProfileSchema = Joi.object({
  ...baseProfileSchema,
  idType: Joi.string()
    .valid('National ID', 'Passport', 'Kebele ID')
    .optional()
    .messages({
      'any.only': 'ID Type must be one of: National ID, Passport, Kebele ID'
    }),
  idNumber: Joi.string()
    .min(commonValidations.idNumber.min)
    .max(commonValidations.idNumber.max)
    .optional()
    .messages({
      'string.min': `ID number must be at least ${commonValidations.idNumber.min} characters`,
      'string.max': `ID number cannot exceed ${commonValidations.idNumber.max} characters`
    })
}).options({ 
  abortEarly: false, 
  stripUnknown: true 
});

module.exports = {
  userProfileSchema,
  updateProfileSchema,
  // addressSchema
};