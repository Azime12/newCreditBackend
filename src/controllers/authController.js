const { userRegister,userLogin,assignPermissionToRoleService,assignRoleToUserService } = require("../services/authService");
const { userRegisterSchema,loginSchema,resetPasswordSchema} = require("../validators/authValidators");
const { requestPasswordReset, resetPassword } = require("../services/authService");
const { requestOTPAuth, verifyOTPAuth } = require("../services/authService");
const { socialLogin,verifyEmailService,resendVerificationEmailService } = require("../services/authService");


const registerUser = async (req, res) => {
  try {
    // 🔹 Validate request body using Joi
    const { error } = userRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // 🔹 If validation passes, call the service to handle registration
    const user = await userRegister(req.body);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// src/controllers/authController.js


const socialAuthController = async (req, res) => {
  const { provider, idToken } = req.body;

  try {
    if (!provider || !idToken) {
      return res.status(400).json({ error: "Provider and ID token are required" });
    }

    const result = await socialLogin(idToken, provider);

    return res.json({
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Social login failed:", error);
    return res.status(400).json({ error: `Social login failed: ${error.message}` });
  }
};



  

  




// Assign Role to User
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    
    // Validate input
    if (!userId || !roleName) {
      return res.status(400).json({ 
        success: false,
        message: "User ID and Role Name are required",
      });
    }

    // Call the service
    const result = await assignRoleToUserService(userId, roleName);
    
    // Success response
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    // Handle different error types with appropriate status codes
    if (error.message.includes("not found")) {
      return res.status(404).json({ 
        success: false,
        message: error.message 
      });
    }
    if (error.message.includes("already has") || error.message.includes("Invalid")) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Failed to assign role",
      error: error.message 
    });
  }
};


// Assign Permission to Role
const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      return res.status(400).json({ message: "Role ID and Permission ID are required" });
    }

    const result = await assignPermissionToRoleService(roleId, permissionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




 const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyEmailService(token);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



 const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await resendVerificationEmailService(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


const loginController = async (req, res) => {
  try {
    // Validate input using Joi schema
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Call the user login service
    const result = await userLogin(req.body);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// passwordResetController.js

const handlePasswordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Call the service to send the password reset email
    const result = await requestPasswordReset(email);

    // Respond with success message
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};




// Controller function to handle password reset
const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Call the service to reset the password
    const result = await resetPassword(token, newPassword);

    // Respond with success message
    res.status(200).json(result);
  } catch (error) {
    // Handle errors (invalid or expired token)
    res.status(400).json({ message: error.message });
  }
};



// Request OTP
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await requestOTPAuth(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify OTP & Authenticate
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await verifyOTPAuth(email, otp);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


  





module.exports={
registerUser,
loginController,
verifyEmail,
handlePasswordResetRequest, 
resetPasswordController,
requestOTP,
verifyOTP ,
assignPermissionToRole,
assignRoleToUser,
resendVerificationEmail,
socialAuthController
}