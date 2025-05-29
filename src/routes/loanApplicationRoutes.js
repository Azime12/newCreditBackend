const express = require('express');
const router = express.Router();
const {
  createLoanApplication,
  getLoanApplicationsByUser,
  getLoanApplicationById,
  updateLoanApplication,
  updateLoanApplicationStatus,
  deleteLoanApplication,
  restoreLoanApplication,
  getAllLoanApplications,
  getApplicationStats
} = require('../controllers/loanApplicationController');

const { authenticate } = require('../middlewares/authMiddleware');

// 🔐 Apply authentication to all routes
router.use(authenticate);

// 📌 Loan Application routes
router.post('/', createLoanApplication);
router.get('/', getAllLoanApplications);
router.get('/user/:userId', getLoanApplicationsByUser);
router.get('/:id', getLoanApplicationById);
router.put('/:id', updateLoanApplication);
router.patch('/:id/status', updateLoanApplicationStatus);
router.delete('/:id', deleteLoanApplication);
router.post('/:id/restore', restoreLoanApplication);
router.get('/stats', getApplicationStats); // optional

module.exports = router;
