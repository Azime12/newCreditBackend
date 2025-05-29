const Joi = require("joi");

const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required()
  .pattern(/^(\+2519\d{8}|09\d{8})$/) // Ethiopian phone numbers: +2519XXXXXXXX or 09XXXXXXXX
  .message("Phone number must be valid (e.g., +251912345678 or 0912345678)"),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  phoneNumber: Joi.string()
    .pattern(/^(\+2519\d{8}|09\d{8})$/) // Ethiopian phone numbers: +2519XXXXXXXX or 09XXXXXXXX
    .message("Phone number must be valid (e.g., +251912345678 or 0912345678)"),
  password: Joi.string().required(),
}).xor("email", "phoneNumber"); // Ensures either email OR phone is required, not both


const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase
    .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase
    .pattern(new RegExp("(?=.*\\d)")) // At least one number
    .pattern(new RegExp("(?=.*[@$!%*?&])")) // At least one special character
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 32 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

module.exports = { userRegisterSchema, loginSchema,resetPasswordSchema };
