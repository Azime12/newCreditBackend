const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { socialAuthController } = require("../controllers/authController");


// User Registration and Login
router.post("/register", authController.registerUser);
router.post("/login", authController.loginController);
router.post("/social-login", socialAuthController);
// Email Verification
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);

// Password Reset
router.post("/request-reset", authController.handlePasswordResetRequest);
router.post("/reset-password", authController.resetPasswordController);

// OTP-based Authentication
router.post("/request-otp", authController.requestOTP);
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
