const express = require("express");
const userController = require("../controllers/userControllers");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users (CRUD, Authentication, and Account Management)
 */

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 *       401:
 *         description: Unauthorized
 */
router.post("/change-password", userController.changePassword);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a specific user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/users/:id", userController.getUserById);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by field and value
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: Field name to search (e.g., email, phoneNumber)
 *       - in: query
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Value to search for
 *     responses:
 *       200:
 *         description: Matched users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing or invalid search parameters
 */
router.get("/users/search", userController.searchUsers);

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Retrieve a specific user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The user's email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/users/email/:email", userController.getUserByEmail);

/**
 * @swagger
 * /users/phone/{phoneNumber}:
 *   get:
 *     summary: Retrieve a specific user by phone number
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         description: The user's phone number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/users/phone/:phoneNumber", userController.getUserByPhoneNumber);

/**
 * @swagger
 * /users/verified:
 *   get:
 *     summary: Retrieve all verified users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of verified users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users/verified", userController.getVerifiedUsers);

/**
 * @swagger
 * /users/unverified:
 *   get:
 *     summary: Retrieve all unverified users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of unverified users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users/unverified", userController.getUnverifiedUsers);

/**
 * @swagger
 * /users/id-type/{idType}:
 *   get:
 *     summary: Retrieve users by ID type
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idType
 *         required: true
 *         description: The type of ID (e.g., passport, national ID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users filtered by ID type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users/id-type/:idType", userController.getUsersByIdType);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
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
 *               - phoneNumber
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Azimeraw
 *               lastName:
 *                 type: string
 *                 example: Taddese
 *               email:
 *                 type: string
 *                 format: email
 *                 example: azimeraw@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               role:
 *                 type: string
 *                 enum: [admin, user, manager]
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request (validation errors)
 *       404:
 *         description: User not found
 */
router.patch("/:id", userController.updateUser);

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Admin registers a user without setting a password and sends a password reset link
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *     responses:
 *       200:
 *         description: User registered successfully. Invitation sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully. Please check your email to set your password."
 *       400:
 *         description: Bad request (validation errors or existing user).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email or phone number already registered."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while processing the request."
 */
router.post("/admin/register", userController.adminUserRegister);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - password
 *         - address
 *         - accountNumber
 *       properties:
 *         id:
 *           type: string
 *           example: "946d8446-c642-4585-919f-5fffe403bbc1"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "1234567890"
 *         password:
 *           type: string
 *           example: "Password123"
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         role:
 *           type: string
 *           example: "customer"
 *         accountNumber:
 *           type: string
 *           example: "AC12345"
 *         creditBalance:
 *           type: number
 *           example: 1000.50
 *         savingBalance:
 *           type: number
 *           example: 500.75
 */

module.exports = router;
