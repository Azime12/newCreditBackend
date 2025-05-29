const express = require("express");
const authController = require("../controllers/authController");

const { requestOTP, verifyOTP } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and account security
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phoneNumber
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongP@ssw0rd!"
 *               phoneNumber:
 *                 type: string
 *                 example: "+251911223344"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully"
 *               userId: "123456789"
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               error: "Email is already in use"
 */
router.post("/register", authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       401:
 *         description: Unauthorized (Invalid credentials)
 */
router.post("/login", authController.loginUser);


/**
 * @swagger
 * /auth/social-login:
 *   post:
 *     summary: Social login with Google
 *     tags: [Authentication]
 *     description: Authenticate users using Google OAuth and generate a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - idToken
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google]
 *                 example: "google"
 *               idToken:
 *                 type: string
 *                 example: "your_google_id_token"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               profileImage:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "your_jwt_token"
 *               user:
 *                 id: 123
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "user@example.com"
 *                 profileImage: "https://example.com/profile.jpg"
 *       400:
 *         description: Bad request (Missing fields or invalid data)
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required fields: provider, idToken"
 *       401:
 *         description: Unauthorized (Invalid ID token or failed verification)
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid Google token"
 *       500:
 *         description: Internal server error (Failed during user creation or database operation)
 *         content:
 *           application/json:
 *             example:
 *               error: "Social login failed: Default role not found"
 */


router.post("/social-login", authController.socialLogin)

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email using a token
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email successfully verified
 *       400:
 *         description: Invalid or expired token
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * @swagger
 * /auth/request-reset:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post("/request-reset", authController.requestPasswordReset);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", authController.resetPassword);
/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request (Invalid email or user not found)
 */
router.post("/request-otp", requestOTP);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", verifyOTP);


module.exports = router;
