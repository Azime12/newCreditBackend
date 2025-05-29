const express = require("express");
const router = express.Router();
const accountNumberController = require("../controllers/accountNumberController");

/**
 * @swagger
 * tags:
 *   - name: Account Number
 *     description: Endpoints for managing user account numbers.
 */

/**
 * @swagger
 * /account-numbers:
 *   post:
 *     tags:
 *       - Account Number
 *     summary: Create a new account number
 *     description: Assigns a unique account number to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier of the user
 *               accountNumber:
 *                 type: string
 *                 description: Unique account number to be assigned
 *     responses:
 *       201:
 *         description: Account number created successfully
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/account-numbers", accountNumberController.createAccountNumber);

/**
 * @swagger
 * /account-numbers/user/{userId}:
 *   get:
 *     tags:
 *       - Account Number
 *     summary: Get account number by user ID
 *     description: Fetches the account number(s) associated with a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier for the user
 *     responses:
 *       200:
 *         description: Account number retrieved successfully
 *       404:
 *         description: No account number found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/account-numbers/user/:userId", accountNumberController.getAccountNumberByUser);

/**
 * @swagger
 * /account-numbers/{accountId}:
 *   get:
 *     tags:
 *       - Account Number
 *     summary: Get account number by ID
 *     description: Fetches a specific account number by its unique ID.
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier for the account number
 *     responses:
 *       200:
 *         description: Account number retrieved successfully
 *       404:
 *         description: Account number not found
 *       500:
 *         description: Internal server error
 */
router.get("/account-numbers/:accountId", accountNumberController.getAccountNumberById);

/**
 * @swagger
 * /account-numbers/{accountId}:
 *   delete:
 *     tags:
 *       - Account Number
 *     summary: Delete an account number
 *     description: Removes an account number from the system.
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier for the account number
 *     responses:
 *       200:
 *         description: Account number deleted successfully
 *       404:
 *         description: Account number not found
 *       500:
 *         description: Internal server error
 */
router.delete("/account-numbers/:accountId", accountNumberController.deleteAccountNumber);

module.exports = router;
