const loanService = require('../services/loanService');
const AppError = require('../utils/appError');
const { 
  loanSchema,
  loanUpdateSchema,
  loanStatusUpdateSchema 
} = require('../validators/loanValidation');

/**
 * @desc    Create a new loan
 * @route   POST /api/loans
 * @access  Private (with loan.create permission)
 */
const createLoan = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = loanSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Create loan
    const loan = await loanService.createLoan({
      ...value,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all loans for a customer
 * @route   GET /api/loans/customer/:customerId
 * @access  Private (with loan.read permission)
 */
const getLoansByCustomer = async (req, res, next) => {
  try {
    const loans = await loanService.getLoansByCustomer(req.params.customerId);
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single loan by ID
 * @route   GET /api/loans/:id
 * @access  Private (with loan.read permission)
 */
const getLoanById = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get loan by loan number
 * @route   GET /api/loans/number/:loanNumber
 * @access  Private (with loan.read permission)
 */
const getLoanByNumber = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanByNumber(req.params.loanNumber);
    
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all loans
 * @route   GET /api/loans
 * @access  Private (with loan.read permission)
 */
const getAllLoans = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const { count, rows: loans } = await loanService.getAllLoans({
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.status(200).json({
      success: true,
      count,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update loan details
 * @route   PUT /api/loans/:id
 * @access  Private (with loan.update permission)
 */
const updateLoan = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = loanUpdateSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const loan = await loanService.updateLoan(
      req.params.id, 
      value
    );

    res.status(200).json({
      success: true,
      message: 'Loan updated successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update loan status
 * @route   PATCH /api/loans/:id/status
 * @access  Private (with loan.approve permission)
 */
const updateLoanStatus = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = loanStatusUpdateSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const loan = await loanService.updateLoanStatus(
      req.params.id,
      {
        ...value,
        updatedBy: req.user.id // Set the authenticated user who updated the status
      }
    );

    res.status(200).json({
      success: true,
      message: 'Loan status updated successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a loan
 * @route   DELETE /api/loans/:id
 * @access  Private (with loan.delete permission)
 */
const deleteLoan = async (req, res, next) => {
  try {
    await loanService.deleteLoan(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore a deleted loan
 * @route   POST /api/loans/:id/restore
 * @access  Private (with loan.restore permission)
 */
const restoreLoan = async (req, res, next) => {
  try {
    const loan = await loanService.restoreLoan(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Loan restored successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate loan balance
 * @route   GET /api/loans/:id/balance
 * @access  Private (with loan.read permission)
 */
const calculateLoanBalance = async (req, res, next) => {
  try {
    const balanceInfo = await loanService.calculateLoanBalance(req.params.id);
    
    if (!balanceInfo) {
      throw new AppError('Loan not found', 404);
    }

    res.status(200).json({
      success: true,
      data: balanceInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};