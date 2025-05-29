const express = require("express");
const {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  reversePayment
} = require("../controllers/loanPaymentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Loan Payments
 *     description: Endpoints for managing loan payments
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     tags:
 *       - Loan Payments
 *     summary: Create a new loan payment
 *     description: Record a payment made toward a loan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanId
 *               - amount
 *               - principalAmount
 *               - interestAmount
 *               - paymentDate
 *               - method
 *             properties:
 *               loanId:
 *                 type: integer
 *                 example: 123
 *               amount:
 *                 type: number
 *                 format: double
 *                 example: 500.00
 *               principalAmount:
 *                 type: number
 *                 format: double
 *                 example: 450.00
 *               interestAmount:
 *                 type: number
 *                 format: double
 *                 example: 50.00
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-15"
 *               method:
 *                 type: string
 *                 enum: [cash, bank_transfer, mobile_money, check, other]
 *                 example: "bank_transfer"
 *               reference:
 *                 type: string
 *                 example: "TRX123456"
 *               notes:
 *                 type: string
 *                 example: "June payment"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 */
router.post("/", createPayment);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     tags:
 *       - Loan Payments
 *     summary: Get payment details
 *     description: Retrieve details of a specific payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPaymentById);

/**
 * @swagger
 * /payments:
 *   get:
 *     tags:
 *       - Loan Payments
 *     summary: List all payments
 *     description: Retrieve all payments with optional filtering
 *     parameters:
 *       - in: query
 *         name: loanId
 *         schema:
 *           type: integer
 *         description: Filter by loan ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, reversed]
 *         description: Filter by payment status
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [cash, bank_transfer, mobile_money, check, other]
 *         description: Filter by payment method
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range filter (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getAllPayments);

/**
 * @swagger
 * /payments/{id}:
 *   patch:
 *     tags:
 *       - Loan Payments
 *     summary: Update payment details
 *     description: Update specific fields of a payment record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: double
 *               principalAmount:
 *                 type: number
 *                 format: double
 *               interestAmount:
 *                 type: number
 *                 format: double
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               method:
 *                 type: string
 *                 enum: [cash, bank_transfer, mobile_money, check, other]
 *               reference:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed, reversed]
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", updatePayment);

/**
 * @swagger
 * /payments/{id}/reverse:
 *   post:
 *     tags:
 *       - Loan Payments
 *     summary: Reverse a payment
 *     description: Mark a completed payment as reversed and update loan balance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reversalReason
 *             properties:
 *               reversalReason:
 *                 type: string
 *                 example: "Payment was duplicated"
 *     responses:
 *       200:
 *         description: Payment reversed successfully
 *       400:
 *         description: Payment cannot be reversed
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post("/:id/reverse", reversePayment);

module.exports = router;