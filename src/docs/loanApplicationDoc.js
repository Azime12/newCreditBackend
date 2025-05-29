const express = require('express');
const router = express.Router();
const {
  createLoanApplication,
  getLoanApplicationsByUser,
  getLoanApplicationById,
  updateLoanApplication,
  updateApplicationStatus,
  deleteLoanApplication,
  restoreLoanApplication,
  getAllApplications,
} = require('../controllers/loanApplicationController');

const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Loan Applications
 *     description: Endpoints for managing loan applications
 */

/**
 * @swagger
 * /loan-applications:
 *   post:
 *     tags: [Loan Applications]
 *     summary: Create a new loan application
 *     security: [bearerAuth: []]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, loanTypeId, principalAmount, termMonths]
 *             properties:
 *               customerId: { type: string, format: uuid }
 *               loanTypeId: { type: string }
 *               principalAmount: { type: number }
 *               termMonths: { type: integer }
 *               purpose: { type: string }
 *     responses:
 *       201: { description: Loan application created }
 */
router.post('/', authorize(['loanApplication.create']), createLoanApplication);

/**
 * @swagger
 * /loan-applications:
 *   get:
 *     tags: [Loan Applications]
 *     summary: Get all loan applications (admin)
 *     security: [bearerAuth: []]
 *     responses:
 *       200: { description: List of all loan applications }
 */
router.get('/', authorize(['loanApplication.read']), getAllApplications);

/**
 * @swagger
 * /loan-applications/user/{userId}:
 *   get:
 *     tags: [Loan Applications]
 *     summary: Get loan applications by user ID
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: User's loan applications }
 */
router.get('/user/:userId', authorize(['loanApplication.read']), getLoanApplicationsByUser);

/**
 * @swagger
 * /loan-applications/{id}:
 *   get:
 *     tags: [Loan Applications]
 *     summary: Get loan application by ID
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Loan application details }
 */
router.get('/:id', authorize(['loanApplication.read']), getLoanApplicationById);

/**
 * @swagger
 * /loan-applications/{id}:
 *   put:
 *     tags: [Loan Applications]
 *     summary: Fully update loan application
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Application updated }
 */
router.put('/:id', authorize(['loanApplication.update']), updateLoanApplication);

/**
 * @swagger
 * /loan-applications/{id}/status:
 *   patch:
 *     tags: [Loan Applications]
 *     summary: Update loan application status
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [approved, rejected, cancelled] }
 *               comments: { type: string }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch('/:id/status', authorize(['loanApplication.approve']), updateApplicationStatus);

/**
 * @swagger
 * /loan-applications/{id}:
 *   delete:
 *     tags: [Loan Applications]
 *     summary: Soft delete a loan application
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Deleted successfully }
 */
router.delete('/:id', authorize(['loanApplication.delete']), deleteLoanApplication);

/**
 * @swagger
 * /loan-applications/{id}/restore:
 *   post:
 *     tags: [Loan Applications]
 *     summary: Restore a deleted loan application
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Restored successfully }
 */
router.post('/:id/restore', authorize(['loanApplication.restore']), restoreLoanApplication);

module.exports = router;
