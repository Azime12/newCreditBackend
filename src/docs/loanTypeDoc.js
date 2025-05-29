const express = require('express');
const router = express.Router();
const loanTypeController = require('../controllers/loanTypeController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Loan Types
 *   description: Loan type management
 */

/**
 * @swagger
 * /loan-types:
 *   get:
 *     tags: [Loan Types]
 *     summary: Get all loan types
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loan types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LoanType'
 */
router.get('/', authenticate, loanTypeController.getAllLoanTypes);

/**
 * @swagger
 * /loan-types:
 *   post:
 *     tags: [Loan Types]
 *     summary: Create a new loan type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanType'
 *     responses:
 *       201:
 *         description: Loan type created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Loan type already exists
 */
router.post('/', authenticate, authorize(['admin']), loanTypeController.createLoanType);

/**
 * @swagger
 * /loan-types/{id}:
 *   get:
 *     tags: [Loan Types]
 *     summary: Get a loan type by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan type details
 *       404:
 *         description: Loan type not found
 */
router.get('/:id', authenticate, loanTypeController.getLoanType);

/**
 * @swagger
 * /loan-types/{id}:
 *   put:
 *     tags: [Loan Types]
 *     summary: Update a loan type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanType'
 *     responses:
 *       200:
 *         description: Loan type updated successfully
 *       404:
 *         description: Loan type not found
 */
router.put('/:id', authenticate, authorize(['admin']), loanTypeController.updateLoanType);

/**
 * @swagger
 * /loan-types/{id}:
 *   delete:
 *     tags: [Loan Types]
 *     summary: Delete a loan type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan type deleted successfully
 *       404:
 *         description: Loan type not found
 */
router.delete('/:id', authenticate, authorize(['admin']), loanTypeController.deleteLoanType);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoanType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Personal Loan"
 *         description:
 *           type: string
 *           example: "Standard personal loan"
 *         interest_rate:
 *           type: number
 *           format: float
 *           example: 12.5
 *         min_term:
 *           type: integer
 *           example: 3
 *         max_term:
 *           type: integer
 *           example: 36
 *         payment_frequency:
 *           type: string
 *           enum: [monthly, weekly, biweekly]
 *           example: "monthly"
 *         min_amount:
 *           type: number
 *           example: 1000.00
 *         max_amount:
 *           type: number
 *           example: 50000.00
 *         is_active:
 *           type: boolean
 *           example: true
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;