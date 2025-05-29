const express = require("express");
const {
  getAllSavingsAccounts,
  getSavingsAccountById,
  getSavingsAccountsByUserId,
  getAccountBalance,
  createSavingsAccount,
  updateSavingsAccount,
  deleteSavingsAccount,
  deposit,
  withdraw,
  transfer
} = require("../controllers/SavingsAccountController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Savings Account
 *     description: Endpoints related to savings account management.
 */

/**
 * @swagger
 * /saving-accounts:
 *   get:
 *     tags:
 *       - Savings Account
 *     summary: Retrieve all savings accounts
 *     description: Fetch all savings accounts with optional pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default = 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of accounts per page (default = 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved savings accounts
 *       500:
 *         description: Failed to retrieve savings accounts
 */
router.get("/", getAllSavingsAccounts);

/**
 * @swagger
 * /saving-accounts/balance/{accountId}:
 *   get:
 *     tags:
 *       - Savings Account
 *     summary: Retrieve the balance of a specific savings account
 *     description: Fetch the balance of a savings account using the account ID.
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the savings account
 *     responses:
 *       200:
 *         description: Successfully retrieved the account balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: string
 *                   description: The unique ID of the savings account
 *                 balance:
 *                   type: number
 *                   format: float
 *                   description: The account balance
 *       400:
 *         description: Missing or invalid account ID
 *       404:
 *         description: Account not found
 *       500:
 *         description: Failed to retrieve account balance
 */
router.get('/balance/:accountId', accountController.getAccountBalance);

/**
 * @swagger
 * /saving-accounts/{id}:
 *   get:
 *     tags:
 *       - Savings Account
 *     summary: Retrieve a savings account by ID
 *     description: Fetch details of a specific savings account by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the savings account
 *     responses:
 *       200:
 *         description: Savings account retrieved successfully
 *       404:
 *         description: Savings account not found
 *       500:
 *         description: Error retrieving savings account
 */
router.get("/:id", getSavingsAccountById);

/**
 * @swagger
 * /saving-accounts/user/{userId}:
 *   get:
 *     tags:
 *       - Savings Account
 *     summary: Retrieve savings accounts by user ID
 *     description: Fetch all savings accounts associated with a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the user
 *     responses:
 *       200:
 *         description: Savings accounts retrieved successfully
 *       404:
 *         description: No savings accounts found for this user
 *       500:
 *         description: Error retrieving savings accounts
 */
router.get("/user/:userId", getSavingsAccountsByUserId);

/**
 * @swagger
 * /saving-accounts:
 *   post:
 *     tags:
 *       - Savings Account
 *     summary: Create a new savings account
 *     description: Create a new savings account for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               accountNumberId:
 *                 type: string
 *               balance:
 *                 type: number
 *             required:
 *               - userId
 *               - accountNumberId
 *     responses:
 *       201:
 *         description: Savings account created successfully
 *       400:
 *         description: Bad request or missing required fields
 *       500:
 *         description: Error creating savings account
 */
router.post("/", createSavingsAccount);

/**
 * @swagger
 * /saving-accounts/{id}:
 *   put:
 *     tags:
 *       - Savings Account
 *     summary: Update a savings account
 *     description: Modify the details of an existing savings account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the savings account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               balance:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, CLOSED]
 *     responses:
 *       200:
 *         description: Savings account updated successfully
 *       404:
 *         description: Savings account not found
 *       500:
 *         description: Error updating savings account
 */
router.put("/:id", updateSavingsAccount);

/**
 * @swagger
 * /saving-accounts/{id}:
 *   delete:
 *     tags:
 *       - Savings Account
 *     summary: Delete a savings account
 *     description: Remove a savings account from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the savings account
 *     responses:
 *       200:
 *         description: Savings account deleted successfully
 *       404:
 *         description: Savings account not found
 *       500:
 *         description: Error deleting savings account
 */
router.delete("/:id", deleteSavingsAccount);

/**
 * @swagger
 * /saving-accounts/deposit:
 *   post:
 *     tags:
 *       - Savings Account
 *     summary: Deposit money into a savings account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/deposit", deposit);

/**
 * @swagger
 * /saving-accounts/withdraw:
 *   post:
 *     tags:
 *       - Savings Account
 *     summary: Withdraw money from a savings account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient funds
 *       500:
 *         description: Internal server error
 */
router.post("/withdraw", withdraw);

/**
 * @swagger
 * /saving-accounts/transfer:
 *   post:
 *     tags:
 *       - Savings Account
 *     summary: Transfer money between savings accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccountId:
 *                 type: string
 *               toAccountId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient funds
 *       500:
 *         description: Internal server error
 */
router.post("/transfer", transfer);

module.exports = router;
