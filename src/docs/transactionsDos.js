const express = require("express");
const {
  createTransaction,
  getTransactionsByUser,
  updateTransactionStatus,
} = require("../controllers/transactionController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Endpoints for managing financial transactions.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "456e1234-f89b-42d3-a456-123456789abc"
 *         transactionType:
 *           type: string
 *           enum: [deposit, withdrawal, repayment, transfer]
 *           example: "deposit"
 *         fromAccountId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "678e2345-d89c-32d3-a456-789456123def"
 *         toAccountId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "789e3456-c89d-22d3-a456-321654987ghi"
 *         amount:
 *           type: number
 *           format: double
 *           example: 500.75
 *         transactionReference:
 *           type: string
 *           nullable: true
 *           example: "TXN123456789"
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED]
 *           example: "COMPLETED"
 *         transactionMetadata:
 *           type: object
 *           example: { "note": "Monthly savings deposit" }
 *         fee:
 *           type: number
 *           format: double
 *           example: 2.50
 *         initiatedBy:
 *           type: string
 *           example: "User"
 *         initiatedFrom:
 *           type: string
 *           example: "Mobile App"
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           example: "2024-03-10T14:48:00.000Z"
 *         processedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2024-03-10T14:50:00.000Z"
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Retrieve all transactions
 *     description: Fetch all transactions with optional pagination.
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
 *         description: Number of transactions per page (default = 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions.
 *       500:
 *         description: Server error retrieving transactions.
 */
 
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Retrieve a specific transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully.
 *       404:
 *         description: Transaction not found.
 *       500:
 *         description: Error retrieving transaction.
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Transaction"
 *     responses:
 *       201:
 *         description: Transaction created successfully.
 *       400:
 *         description: Invalid request parameters.
 *       500:
 *         description: Error creating transaction.
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     tags:
 *       - Transactions
 *     summary: Update transaction status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED]
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Transaction updated successfully.
 *       400:
 *         description: Invalid transaction update request.
 *       404:
 *         description: Transaction not found.
 *       500:
 *         description: Error updating transaction.
 */

/**
 * @swagger
 * /transactions/user/{userId}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Retrieve transactions by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully.
 *       404:
 *         description: No transactions found for this user.
 *       500:
 *         description: Error retrieving transactions.
 */

/**
 * @swagger
 * /transactions/date:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Retrieve transactions by date range
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully.
 *       400:
 *         description: Start date and end date are required.
 *       500:
 *         description: Error retrieving transactions.
 */
