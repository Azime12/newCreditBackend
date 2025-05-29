const { Op } = require('sequelize');
const { LoanType } = require('../models/loan');
const { PaymentFrequency } = require('../constants/enums');
const AppError = require('../utils/appError');
const { createLoanTypeSchema, updateLoanTypeSchema } = require('../validators/loanTypeValidation');
const sequelize = require('../config/database');

async function create(data) {
  try {
    const { error } = createLoanTypeSchema.validate(data);
    if (error) {
      throw new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400);
    }

    const existingLoanType = await LoanType.findOne({ 
      where: { name: data.name },
      paranoid: false
    });

    if (existingLoanType) {
      throw new AppError('Loan type with this name already exists', 409);
    }

    validateLoanTypeBusinessRules(data);

    return await LoanType.create(data);
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError(`Failed to create loan type: ${error.message}`, 500);
    }
    throw error;
  }
}

async function findAll() {
  try {
    return await LoanType.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });
  } catch (error) {
    throw new AppError(`Failed to fetch loan types: ${error.message}`, 500);
  }
}

async function findById(id, options = {}) {
  try {
    if (!id) {
      throw new AppError('Loan type ID is required', 400);
    }

    const loanType = await LoanType.findByPk(id, {
      paranoid: !options.includeInactive,
      ...options
    });

    if (!loanType) {
      throw new AppError('Loan type not found', 404);
    }

    return loanType;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError(`Failed to find loan type: ${error.message}`, 500);
    }
    throw error;
  }
}

async function update(id, data) {
  try {
    if (!id) {
      throw new AppError('Loan type ID is required', 400);
    }

    const { error } = updateLoanTypeSchema.validate(data);
    if (error) {
      throw new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400);
    }

    const loanType = await findById(id);

    if (data.name && data.name !== loanType.name) {
      const exists = await LoanType.findOne({ 
        where: { 
          name: data.name,
          id: { [Op.ne]: id }
        },
        paranoid: false
      });

      if (exists) {
        throw new AppError('Loan type with this name already exists', 409);
      }
    }

    validateLoanTypeBusinessRules({
      ...loanType.get({ plain: true }),
      ...data
    });

    return await loanType.update(data);
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError(`Failed to update loan type: ${error.message}`, 500);
    }
    throw error;
  }
}

async function remove(id) {
  try {
    if (!id) {
      throw new AppError('Loan type ID is required', 400);
    }

    const loanType = await findById(id);

    // Make sure association method name matches your model setup:
    const activeLoansCount = await loanType.countLoans({
      where: { 
        status: { [Op.notIn]: ['paid', 'cancelled'] }
      }
    });

    if (activeLoansCount > 0) {
      throw new AppError('Cannot delete loan type with active loans', 400);
    }

    await loanType.destroy();
    return true;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError(`Failed to delete loan type: ${error.message}`, 500);
    }
    throw error;
  }
}

async function restore(id) {
  try {
    if (!id) {
      throw new AppError('Loan type ID is required', 400);
    }

    const loanType = await LoanType.findByPk(id, { paranoid: false });

    if (!loanType) {
      throw new AppError('Loan type not found', 404);
    }

    if (!loanType.deletedAt) {
      throw new AppError('Loan type is not deleted', 400);
    }

    await loanType.restore();
    return loanType;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError(`Failed to restore loan type: ${error.message}`, 500);
    }
    throw error;
  }
}

async function getLoanTypeStats() {
  try {
    return await LoanType.findAll({
      attributes: [
        'is_active',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('interest_rate')), 'avg_interest_rate']
      ],
      group: ['is_active']
    });
  } catch (error) {
    throw new AppError(`Failed to get loan type stats: ${error.message}`, 500);
  }
}

function validateLoanTypeBusinessRules(data) {
  if (!Object.values(PaymentFrequency).includes(data.payment_frequency)) {
    throw new AppError('Invalid payment frequency', 400);
  }

  if (data.min_term > data.max_term) {
    throw new AppError('Minimum term cannot be greater than maximum term', 400);
  }

  if (data.min_amount > data.max_amount) {
    throw new AppError('Minimum amount cannot be greater than maximum amount', 400);
  }

  if (data.requires_collateral && (!data.collateral_coverage_ratio || 
      data.collateral_coverage_ratio < 1 || data.collateral_coverage_ratio > 5)) {
    throw new AppError('Collateral coverage ratio must be between 1 and 5 when collateral is required', 400);
  }
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: remove,
  restore,
  getLoanTypeStats,
};
