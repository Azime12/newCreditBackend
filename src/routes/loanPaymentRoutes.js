const express = require('express');
const router = express.Router();
const loanPaymentController = require('../controllers/loanPaymentController');
const {authenticate} = require('../middlewares/authMiddleware');

router.post('/', authenticate, loanPaymentController.createPayment);
router.get('/', authenticate, loanPaymentController.getPayments);
router.get('/:paymentId', authenticate, loanPaymentController.getPayment);
router.patch('/:paymentId', authenticate, loanPaymentController.updatePayment);
router.post('/:paymentId/reverse', authenticate, loanPaymentController.reversePayment);
router.patch('/:paymentId/verify', authenticate, loanPaymentController.verifyPayment);

module.exports = router;