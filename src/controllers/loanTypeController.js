const loanTypeService = require('../services/loanTypeService');
const { createLoanTypeSchema, updateLoanTypeSchema } = require('../validators/loanTypeValidation');
const AppError = require('../utils/appError');

module.exports = {
  async create(req, res, next) {
    try {
      const { error } = createLoanTypeSchema.validate(req.body);
      if (error) throw new AppError(error.details[0].message, 400);

      const loanType = await loanTypeService.create(req.body);

      res.status(201).json({
        status: 'success',
        data: { loanType }
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const loanTypes = await loanTypeService.findAll();
      res.json({
        status: 'success',
        data: { loanTypes }
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const id=req.params.id;
      const loanType = await loanTypeService.findById();
      if (!loanType) throw new AppError('Loan type not found', 404);

      res.json({
        status: 'success',
        data: { loanType }
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { error } = updateLoanTypeSchema.validate(req.body);
      if (error) throw new AppError(error.details[0].message, 400);
      const id=req.params.id;
      const loanType = await loanTypeService.update(req.params.id, req.body);
      res.json({
        status: 'success',
        data: { loanType }
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanTypeService.delete(req.params.id);
      res.json({
        status: 'success',
        data: null,
        message: 'Loan type deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async restore(req, res, next) {
    try {
      const loanType = await loanTypeService.restore(req.params.id);
      res.json({
        status: 'success',
        data: { loanType },
        message: 'Loan type restored successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getLoanTypeStats(req, res, next) {
    try {
      const stats = await loanTypeService.getLoanTypeStats();
      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
};
