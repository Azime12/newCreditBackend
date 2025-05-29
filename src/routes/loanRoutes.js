const express = require('express');
const router = express.Router();
const {
  createLoan,
  getLoansByCustomer,
  getLoanById,
  getLoanByNumber,
  getAllLoans,
  updateLoan,
  updateLoanStatus,
  deleteLoan,
  restoreLoan,
  calculateLoanBalance
} = require('../controllers/loanController');
const { authenticate } = require('../middlewares/authMiddleware'); // Removed authorize


// Apply authentication to all routes
router.use(authenticate);

// Loan routes
router.post('/', createLoan);
router.get('/customer/:customerId', getLoansByCustomer);
router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.get('/number/:loanNumber', getLoanByNumber);
router.put('/:id', updateLoan);
router.patch('/:id/status', updateLoanStatus);
router.delete('/:id', deleteLoan);
router.post('/:id/restore', restoreLoan);
router.get('/:id/balance', calculateLoanBalance);

module.exports = router;