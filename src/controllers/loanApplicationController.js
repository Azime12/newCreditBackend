// controllers/loanApplicationController.js
const loanApplicationService = require('../services/loanApplicationService');
const AppError = require('../utils/appError');
const { 
  loanApplicationSchema,
  loanApplicationUpdateSchema,
  statusUpdateSchema 
} = require('../validators/loanApplicationValidation');

/**
 * @desc    Create a new loan application
 * @route   POST /api/loan-applications
 * @access  Private (with loanApplication.create permission)
 */
const createLoanApplication = async (req, res, next) => {
  try {
    // Create a copy of body without unwanted fields
    const bodyWithoutExtraFields = {...req.body};
    delete bodyWithoutExtraFields.saving_account_id;
    
    const { error, value } = loanApplicationSchema.validate(bodyWithoutExtraFields);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    if (!value.branch_id && req.user.branch_id) {
      value.branch_id = req.user.branch_id;
    }

    const application = await loanApplicationService.createLoanApplication({
      ...value,
      customerId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all loan applications with filtering and pagination
 * @route   GET /api/loan-applications
 * @access  Private (with loanApplication.read permission)
 */
const getAllLoanApplications = async (req, res, next) => {
  try {
    const applications = await loanApplicationService.getAllLoanApplications();
    
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all loan applications for a user
 * @route   GET /api/loan-applications/user/:userId
 * @access  Private (with loanApplication.read permission)
 */
const getLoanApplicationsByUser = async (req, res, next) => {
  try {
    const applications = await loanApplicationService.getLoanApplicationsByUser(req.params.userId);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single loan application by ID
 * @route   GET /api/loan-applications/:id
 * @access  Private (with loanApplication.read permission)
 */
const getLoanApplicationById = async (req, res, next) => {
  try {
    const application = await loanApplicationService.getLoanApplicationById(req.params.id);
    
    if (!application) {
      throw new AppError('Loan application not found', 404);
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update loan application details
 * @route   PUT /api/loan-applications/:id
 * @access  Private (with loanApplication.update permission)
 */
const updateLoanApplication = async (req, res, next) => {
  try {
    const { error, value } = loanApplicationUpdateSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const application = await loanApplicationService.updateLoanApplication(
      req.params.id, 
      value
    );

    res.status(200).json({
      success: true,
      message: 'Loan application updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update loan application status
 * @route   PATCH /api/loan-applications/:id/status
 * @access  Private (with loanApplication.approve permission)
 */
const updateLoanApplicationStatus = async (req, res, next) => {
  try {
    const { error, value } = statusUpdateSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const application = await loanApplicationService.updateLoanApplicationStatus(
      req.params.id,
      {
        ...value,
        decisionBy: req.user.id
      }
    );

    res.status(200).json({
      success: true,
      message: 'Loan application status updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a loan application
 * @route   DELETE /api/loan-applications/:id
 * @access  Private (with loanApplication.delete permission)
 */
const deleteLoanApplication = async (req, res, next) => {
  try {
    await loanApplicationService.deleteLoanApplication(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Loan application deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore a deleted loan application
 * @route   POST /api/loan-applications/:id/restore
 * @access  Private (with loanApplication.restore permission)
 */
const restoreLoanApplication = async (req, res, next) => {
  try {
    const application = await loanApplicationService.restoreLoanApplication(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Loan application restored successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get loan application statistics
 * @route   GET /api/loan-applications/stats
 * @access  Private (with loanApplication.read permission)
 */
const getApplicationStats = async (req, res, next) => {
  try {
    const stats = await loanApplicationService.getApplicationStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLoanApplication,
  getAllLoanApplications,
  getLoanApplicationsByUser,
  getLoanApplicationById,
  updateLoanApplication,
  updateLoanApplicationStatus,
  deleteLoanApplication,
  restoreLoanApplication,
  getApplicationStats
};