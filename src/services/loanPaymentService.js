  const { LoanPayment, Loan, User } = require('../models/loan');
  const { Op } = require('sequelize');

  module.exports = {
  // Update your existing createPayment method in loanPaymentService.js
  createPayment: async (paymentData) => {
    const loan = await Loan.findByPk(paymentData.loanId);
    if (!loan) throw new Error('Loan not found');
    if (loan.status !== 'active') throw new Error('Payments can only be made on active loans');

    const lastPayment = await LoanPayment.findOne({
      where: { loanId: paymentData.loanId },
      order: [['paymentNumber', 'DESC']],
    });
    const paymentNumber = lastPayment ? lastPayment.paymentNumber + 1 : 1;

    return await LoanPayment.create({
      ...paymentData,
      paymentNumber,
      status: 'pending' // Changed from 'completed' to 'pending'
    });
  },

    // Add this method to your existing service


    verifyPayment: async (paymentId, action, verificationData) => {
      const payment = await LoanPayment.findByPk(paymentId);
      if (!payment) throw new Error('Payment not found');
      
      if (payment.status !== 'pending') {
        throw new Error(`Payment is already ${payment.status}`);
      }

      const loan = await Loan.findByPk(payment.loanId);
      if (!loan) throw new Error('Loan not found');

      if (action === 'approve') {
        const newBalance = parseFloat(loan.balance) - parseFloat(payment.principalAmount);
        if (newBalance < 0) throw new Error('Payment amount exceeds loan balance');

        await payment.update({
          status: 'completed',
          verifiedBy: verificationData.verifiedBy,
          verificationDate: new Date(),
          verificationNotes: verificationData.reason
        });

        await loan.update({
          balance: newBalance.toFixed(2),
          lastPaymentDate: payment.paymentDate,
          ...(newBalance <= 0 && { status: 'paid' })
        });

        return payment;
      } 
      
      if (action === 'reject') {
        return await payment.update({
          status: 'rejected',
          verifiedBy: verificationData.verifiedBy,
          verificationDate: new Date(),
          verificationNotes: verificationData.reason || 'Payment rejected'
        });
      }

      throw new Error('Invalid action');
    }
  ,
  // Update your existing getPaymentById method in loanPaymentService.js
  getPaymentById: async (paymentId) => {
    return await LoanPayment.findByPk(paymentId, {
      include: [
        { model: Loan, as: 'loan' },
        { model: User, as: 'recorder' },
        { model: User, as: 'verifiedBy', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });
  },

    getPayments: async (filter = {}) => {
      const { loanId, status, method, startDate, endDate, page = 1, limit = 10 } = filter;

      const where = {};
      if (loanId) where.loanId = loanId;
      if (status) where.status = status;
      if (method) where.method = method;
      if (startDate && endDate) {
        where.paymentDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      return await LoanPayment.findAndCountAll({
        where,
        include: [{
          model: Loan,
          as: 'loan',
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        }],
        order: [['paymentDate', 'DESC']],
        limit,
        offset: (page - 1) * limit,
      });
    },

    updatePayment: async (paymentId, updateData) => {
      const payment = await LoanPayment.findByPk(paymentId);
      if (!payment) throw new Error('Payment not found');
      if (payment.status === 'completed' && updateData.status !== 'reversed') {
        throw new Error('Completed payments cannot be modified');
      }
      return await payment.update(updateData);
    },

    reversePayment: async (paymentId, reversalReason) => {
      const payment = await LoanPayment.findByPk(paymentId);
      if (!payment) throw new Error('Payment not found');
      if (payment.status !== 'completed') throw new Error('Only completed payments can be reversed');

      const loan = await Loan.findByPk(payment.loanId);
      if (!loan) throw new Error('Loan not found');

      const newBalance = parseFloat(loan.balance) + parseFloat(payment.principalAmount);
      await loan.update({
        balance: newBalance.toFixed(2),
        status: newBalance > 0 ? 'active' : loan.status
      });

      return await payment.update({
        status: 'reversed',
        notes: reversalReason
      });
    }
  };
