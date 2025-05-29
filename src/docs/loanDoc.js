const express = require("express");
const loanController = require("../controllers/loanController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Loan Management
 *     description: API endpoints for managing loans in the system
 */

/**
 * @swagger
 * /loans:
 *   post:
 *     tags:
 *       - Loan Management
 *     summary: Create a new loan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - loanTypeId
 *               - principalAmount
 *               - interestRate
 *               - termMonths
 *               - disbursementDate
 *               - dueDate
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the customer
 *               loanTypeId:
 *                 type: integer
 *                 description: ID of the loan type
 *               applicationId:
 *                 type: integer
 *                 description: ID of the loan application (optional)
 *               principalAmount:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 10000.50
 *               interestRate:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 5.5
 *               termMonths:
 *                 type: integer
 *                 minimum: 1
 *                 example: 12
 *               disbursementDate:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, active, paid, defaulted, cancelled]
 *                 default: pending
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       500:
 *         description: Internal server error
 */
router.post("/", loanController.createLoan);

/**
 * @swagger
 * /loans/customer/{customerId}:
 *   get:
 *     tags:
 *       - Loan Management
 *     summary: Get all loans for a specific customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Successfully retrieved loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       500:
 *         description: Internal server error
 */
router.get("/customer/:customerId", loanController.getLoansByCustomer);

/**
 * @swagger
 * /loans:
 *   get:
 *     tags:
 *       - Loan Management
 *     summary: Get all loans with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, paid, defaulted, cancelled]
 *         description: Filter by loan status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved loans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of loans
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       500:
 *         description: Internal server error
 */
router.get("/", loanController.getAllLoans);

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     tags:
 *       - Loan Management
 *     summary: Get a loan by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Successfully retrieved loan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", loanController.getLoanById);

/**
 * @swagger
 * /loans/number/{loanNumber}:
 *   get:
 *     tags:
 *       - Loan Management
 *     summary: Get a loan by loan number
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan number
 *     responses:
 *       200:
 *         description: Successfully retrieved loan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.get("/number/:loanNumber", loanController.getLoanByNumber);

/**
 * @swagger
 * /loans/{id}:
 *   put:
 *     tags:
 *       - Loan Management
 *     summary: Update loan details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               principalAmount:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *               interestRate:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 maximum: 100
 *               termMonths:
 *                 type: integer
 *                 minimum: 1
 *               disbursementDate:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, active, paid, defaulted, cancelled]
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", loanController.updateLoan);

/**
 * @swagger
 * /loans/{id}/status:
 *   patch:
 *     tags:
 *       - Loan Management
 *     summary: Update loan status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, active, paid, defaulted, cancelled]
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loan status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/status", loanController.updateLoanStatus);

/**
 * @swagger
 * /loans/{id}:
 *   delete:
 *     tags:
 *       - Loan Management
 *     summary: Delete a loan (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", loanController.deleteLoan);

/**
 * @swagger
 * /loans/{id}/restore:
 *   post:
 *     tags:
 *       - Loan Management
 *     summary: Restore a deleted loan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found or not deleted
 *       500:
 *         description: Internal server error
 */
router.post("/:id/restore", loanController.restoreLoan);

/**
 * @swagger
 * /loans/{id}/balance:
 *   get:
 *     tags:
 *       - Loan Management
 *     summary: Calculate loan balance and payment information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan balance calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 principalAmount:
 *                   type: number
 *                   format: double
 *                 interestRate:
 *                   type: number
 *                   format: double
 *                 termMonths:
 *                   type: integer
 *                 totalAmount:
 *                   type: number
 *                   format: double
 *                 totalPayments:
 *                   type: number
 *                   format: double
 *                 balance:
 *                   type: number
 *                   format: double
 *                 lastPaymentDate:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                 nextPaymentDue:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (no permission)
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/balance", loanController.calculateLoanBalance);

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         loanNumber:
 *           type: string
 *         customerId:
 *           type: string
 *           format: uuid
 *         loanTypeId:
 *           type: integer
 *         applicationId:
 *           type: integer
 *           nullable: true
 *         principalAmount:
 *           type: number
 *           format: double
 *         interestRate:
 *           type: number
 *           format: double
 *         termMonths:
 *           type: integer
 *         disbursementDate:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [pending, active, paid, defaulted, cancelled]
 *         balance:
 *           type: number
 *           format: double
 *         lastPaymentDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         loanType:
 *           $ref: '#/components/schemas/LoanType'
 *         payments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LoanPayment'
 * 
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 * 
 *     LoanType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         interestRate:
 *           type: number
 *           format: double
 * 
 *     LoanPayment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *           format: double
 *         paymentDate:
 *           type: string
 *           format: date
 *         paymentMethod:
 *           type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;