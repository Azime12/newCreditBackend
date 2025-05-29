const Joi = require("joi");

// Regex patterns defined in the same file for simplicity
const PHONE_REGEX = /^(\+?[0-9]{7,15}|0[0-9]{9,15})$/;
const POSTAL_CODE_REGEX = /^[A-Za-z0-9 -]{3,10}$/;

const createBranchSchema = Joi.object({
  branchName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Branch name is required',
      'string.min': 'Branch name must be at least {#limit} characters',
      'string.max': 'Branch name must not exceed {#limit} characters'
    }),
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least {#limit} characters',
      'string.max': 'Address must not exceed {#limit} characters'
    }),
  city: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City name must be at least {#limit} characters',
      'string.max': 'City name must not exceed {#limit} characters'
    }),
  state: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'State is required',
      'string.min': 'State must be at least {#limit} characters',
      'string.max': 'State must not exceed {#limit} characters'
    }),
  postalCode: Joi.string()
    .trim()
    .pattern(POSTAL_CODE_REGEX)
    .required()
    .messages({
      'string.empty': 'Postal code is required',
      'string.pattern.base': 'Postal code must be 3-10 alphanumeric characters with optional space or hyphen'
    }),
  country: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Country is required',
      'string.min': 'Country must be at least {#limit} characters',
      'string.max': 'Country must not exceed {#limit} characters'
    }),
  phone: Joi.string()
    .trim()
    .pattern(PHONE_REGEX)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone must be valid (e.g., +251912345678 or 0912345678)'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  openingDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Please enter a valid date',
      'date.max': 'Opening date cannot be in the future',
      'any.required': 'Opening date is required'
    }),
  status: Joi.string()
    .valid("active", "inactive", "closed")
    .default("active")
    .messages({
      'any.only': 'Status must be either active, inactive, or closed'
    }),
  managerId: Joi.string()
    .uuid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.guid': 'Manager ID must be a valid UUID'
    })
}).options({ abortEarly: false });

// const Joi = require('joi');

// const POSTAL_CODE_REGEX = /^[a-zA-Z0-9\- ]{3,10}$/;
// const PHONE_REGEX = /^(\+251|0)?9\d{8}$/;

const updateBranchSchema = Joi.object({
  branchName: Joi.string().trim().min(2).max(100),
  address: Joi.string().trim().min(5).max(200),
  city: Joi.string().trim().min(2).max(50),
  state: Joi.string().trim().min(2).max(50),
  postalCode: Joi.string().trim().pattern(POSTAL_CODE_REGEX),
  country: Joi.string().trim().min(2).max(50),
  phone: Joi.string().trim().pattern(PHONE_REGEX),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase(),
  openingDate: Joi.date().max('now'),
  status: Joi.string().valid('active', 'inactive', 'closed'),
  managerId: Joi.string().uuid({ version: 'uuidv4' })
}).options({ abortEarly: false });

module.exports = {
  updateBranchSchema
};

module.exports = {
  createBranchSchema,
  updateBranchSchema,
  PHONE_REGEX,
  POSTAL_CODE_REGEX
};