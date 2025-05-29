const loanPaymentService = require('../services/loanPaymentService');
const AppError = require('../utils/appError');
const {
  createPaymentSchema,
  updatePaymentSchema,
  paymentIdSchema,
  getPaymentsSchema,
  reversePaymentSchema,
  verifyPaymentSchema
} = require('../validators/loanPaymentValidation');

module.exports = {
  createPayment: async (req, res, next) => {
    try {
      const { error, value } = createPaymentSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details.map(d => d.message).join(', '), 400));
      }

      const payment = await loanPaymentService.createPayment({
        ...value,
        recordedBy: req.user.id
      });
      
      res.status(201).json({
        status: 'success',
        data: { payment }
      });
    } catch (err) {
      next(err);
    }
  },

  verifyPayment: async (req, res, next) => {
    try {
      const paramsValidation = paymentIdSchema.validate(req.params);
      const bodyValidation = verifyPaymentSchema.validate(req.body);
      
      if (paramsValidation.error || bodyValidation.error) {
        const errors = [paramsValidation.error, bodyValidation.error]
          .filter(e => e)
          .map(e => e.details.map(d => d.message))
          .flat();
        return next(new AppError(errors.join(', '), 400));
      }

      const payment = await loanPaymentService.verifyPayment(
        paramsValidation.value.paymentId,
        bodyValidation.value.action,
        {
          verifiedBy: req.user.id,
          reason: bodyValidation.value.reason
        }
      );
      
      res.status(200).json({
        status: 'success',
        data: { payment }
      });
    } catch (err) {
      next(err);
    }
  },

  getPayment: async (req, res, next) => {
    try {
      const { error, value } = paymentIdSchema.validate(req.params);
      if (error) {
        return next(new AppError('Invalid payment ID', 400));
      }

      const payment = await loanPaymentService.getPaymentById(value.paymentId);
      if (!payment) {
        return next(new AppError('Payment not found', 404));
      }

      res.status(200).json({
        status: 'success',
        data: { payment }
      });
    } catch (err) {
      next(err);
    }
  },

 getPayments: async (req, res, next) => {
    try {
      const filter = req.query;
      const result = await loanPaymentService.getPayments(filter);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },


  updatePayment: async (req, res, next) => {
    try {
      const paramsValidation = paymentIdSchema.validate(req.params);
      const bodyValidation = updatePaymentSchema.validate(req.body);
      
      if (paramsValidation.error || bodyValidation.error) {
        const errors = [paramsValidation.error, bodyValidation.error]
          .filter(e => e)
          .map(e => e.details.map(d => d.message))
          .flat();
        return next(new AppError(errors.join(', '), 400));
      }

      const payment = await loanPaymentService.updatePayment(
        paramsValidation.value.paymentId,
        bodyValidation.value
      );
      
      res.status(200).json({
        status: 'success',
        data: { payment }
      });
    } catch (err) {
      next(err);
    }
  },

  reversePayment: async (req, res, next) => {
    try {
      const paramsValidation = paymentIdSchema.validate(req.params);
      const bodyValidation = reversePaymentSchema.validate(req.body);
      
      if (paramsValidation.error || bodyValidation.error) {
        const errors = [paramsValidation.error, bodyValidation.error]
          .filter(e => e)
          .map(e => e.details.map(d => d.message))
          .flat();
        return next(new AppError(errors.join(', '), 400));
      }

      const payment = await loanPaymentService.reversePayment(
        paramsValidation.value.paymentId,
        bodyValidation.value.reversalReason
      );
      
      res.status(200).json({
        status: 'success',
        data: { payment }
      });
    } catch (err) {
      next(err);
    }
  }
};