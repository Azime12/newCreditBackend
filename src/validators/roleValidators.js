const Joi = require("joi");

// Joi schema for role creation
const roleSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Role name is required.",
    "any.required": "Role name is required.",
  }),
});

module.exports={
    roleSchema,
    
}