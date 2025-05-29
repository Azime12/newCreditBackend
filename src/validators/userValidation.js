const Joi = require('joi');
const userIdSchema = Joi.object({
  userId: Joi.string().uuid().required(), // or whatever your validation logic is
});
const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message('Phone number must be 10-15 digits long')
    .required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
    .message('Password must be at least 8 characters long and contain at least one letter and one number')
    .required(),
});
const updateUserInfoSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  roleId: Joi.required(),
});

//

// Joi validation schema for Admin User Registration
const adminUserRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message('Phone number must be 10-15 digits long')
    .required(),
});


// Login schema validation
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  password: Joi.string().min(6).required(),
}).or('email', 'phoneNumber').messages({
  'object.missing': 'Either email or phone number is required',
});

// Change password schema validation
const validateChangePassword = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
      'string.empty': 'Current password is required',
      'string.min': 'Current password must be at least 6 characters',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters',
    }),
  });

  return schema.validate(data);
};

// Update user profile validation
const updateUserProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message('Phone number must be 10-15 digits long')
    .optional(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
    .message('Password must be at least 8 characters long and contain at least one letter and one number')
    .optional(),
  // Optionally validate role if the system supports it
  role: Joi.string().valid('admin', 'user', 'manager').optional(),
}).min(1); // Ensure at least one field is provided to update

// API validation for deleting user (e.g., soft delete or permanent delete)
const deleteUserValidation = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),
});

// API validation for activating or deactivating a user
const activeAndDeactiveUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),
  status: Joi.string().valid('active', 'inactive').required().messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be either "active" or "inactive"',
  }),
});

// API validation for getting a verified user
const getVerifiedUserSchema = Joi.object({
  verified: Joi.boolean().optional(),
});

// API validation for getting unverified user
const getUnverifiedUserSchema = Joi.object({
  verified: Joi.boolean().optional(),
});

// ✅ Export all schemas
module.exports = {
  adminUserRegisterSchema,
  userRegisterSchema,
  loginSchema,
  updateUserInfoSchema,
  validateChangePassword,
  updateUserProfileSchema,
  deleteUserValidation,
  activeAndDeactiveUserSchema,
  getVerifiedUserSchema,
  getUnverifiedUserSchema,
  userIdSchema,
};
