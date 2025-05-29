const { Loan, LoanType, User, LoanApplication, LoanPayment } = require("../models/loan");
const AppError = require("../utils/appError");
const generateLoanNumber = require("../utils/generateLoanNumber");

// Create a new loan
const createLoan = async (loanData) => {
  try {
    const loanType = await LoanType.findByPk(loanData.loanTypeId);
    if (!loanType) {
      throw new AppError('Invalid loan type ID. Loan type does not exist.', 400);
    }

    // Validate customer exists
    const customer = await User.findByPk(loanData.customerId);
    if (!customer) {
      throw new AppError('Invalid customer ID. Customer does not exist.', 400);
    }

    // Validate application exists if provided
    if (loanData.applicationId) {
      const application = await LoanApplication.findByPk(loanData.applicationId);
      if (!application) {
        throw new AppError('Invalid application ID. Loan application does not exist.', 400);
      }
    }

    const loanNumber = generateLoanNumber();

    const loan = await Loan.create({
      ...loanData,
      loanNumber,
      balance: loanData.principalAmount,
      status: 'pending'
    });

    return loan;
  } catch (error) {
    throw error;
  }
};

// Get loans for a specific customer
const getLoansByCustomer = async (customerId) => {
  try {
    const loans = await Loan.findAll({
      where: { customerId },
      include: [
        {
          model: LoanType,
          as: 'loanType',
          attributes: ['id', 'name', 'description']
        },
        {
          model: LoanPayment,
          as: 'payments',
          attributes: ['id', 'amount', 'paymentDate']
        }
        ,
         
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
       
      ],
      order: [['createdAt', 'DESC']]
    });

    return loans;
  } catch (error) {
    throw new AppError('Failed to fetch loans', 500);
  }
};

// Get a single loan by ID
const getLoanById = async (id) => {
  try {
    const loan = await Loan.findByPk(id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: LoanType,
          as: 'loanType',
          attributes: ['id', 'name', 'description', 'interest_rate']
        },
        {
          model: LoanApplication,
          as: 'application',
          attributes: ['id', 'applicationNumber', 'status']
        },
        {
          model: LoanPayment,
          as: 'payments',
          attributes: ['id', 'amount', 'paymentDate', 'method']
        },
        // {
        //   model: User,
        //   as: 'createdByUser',
        //   attributes: ['id', 'firstName', 'lastName']
        // }
      ]
    });

    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    return loan;
  } catch (error) {
    throw error;
  }
};

// Get loan by loan number
const getLoanByNumber = async (loanNumber) => {
  try {
    const loan = await Loan.findOne({
      where: { loanNumber },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: LoanType,
          as: 'loanType',
          attributes: ['id', 'name', 'description', 'interest_rate']
        }
      ]
    });

    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    return loan;
  } catch (error) {
    throw error;
  }
};

// Get all loans with pagination
const getAllLoans = async ({ status, page, limit }) => {
  try {
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Loan.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: LoanType,
          as: 'loanType',
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return { count, rows };
  } catch (error) {
    throw new AppError('Failed to fetch loans', 500);
  }
};

// Update loan details
const updateLoan = async (id, updateData) => {
  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    // Prevent updating certain fields
    const restrictedFields = ['loanNumber', 'customerId', 'loanTypeId'];
    restrictedFields.forEach(field => {
      if (updateData[field]) {
        throw new AppError(`Cannot update ${field} field`, 400);
      }
    });

    const updatedLoan = await loan.update(updateData);
    return updatedLoan;
  } catch (error) {
    throw error;
  }
};

// Update loan status
const updateLoanStatus = async (id, statusData) => {
  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    const updatedLoan = await loan.update({
      status: statusData.status,
      updatedBy: statusData.updatedBy,
      statusUpdatedAt: new Date(),
      comments: statusData.comments || null
    });

    return updatedLoan;
  } catch (error) {
    throw error;
  }
};

// Delete a loan
const deleteLoan = async (id) => {
  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    if (loan.status === 'active') {
      throw new AppError('Cannot delete active loans', 400);
    }

    await loan.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

// Restore a deleted loan
const restoreLoan = async (id) => {
  try {
    const loan = await Loan.findOne({
      where: { id },
      paranoid: false
    });

    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    if (!loan.deletedAt) {
      throw new AppError('Loan is not deleted', 400);
    }

    await loan.restore();
    return loan;
  } catch (error) {
    throw error;
  }
};

// Calculate loan balance
const calculateLoanBalance = async (loanId) => {
  try {
    const loan = await Loan.findByPk(loanId, {
      include: [
        {
          model: LoanPayment,
          as: 'payments',
          attributes: ['amount', 'paymentDate']
        }
      ]
    });

    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    const totalPayments = loan.payments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    );

    const interest = (loan.principalAmount * loan.interestRate * loan.termMonths) / (12 * 100);
    const totalAmount = parseFloat(loan.principalAmount) + interest;
    const balance = totalAmount - totalPayments;

    return {
      principalAmount: loan.principalAmount,
      interestRate: loan.interestRate,
      termMonths: loan.termMonths,
      totalAmount,
      totalPayments,
      balance,
      lastPaymentDate: loan.payments.length > 0 
        ? loan.payments[loan.payments.length - 1].paymentDate 
        : null,
      nextPaymentDue: calculateNextPaymentDue(loan.dueDate, loan.payments)
    };
  } catch (error) {
    throw error;
  }
};

// Helper function to calculate next payment due date
const calculateNextPaymentDue = (dueDate, payments) => {
  if (!payments || payments.length === 0) {
    return dueDate;
  }
  
  const lastPaymentDate = new Date(Math.max(...payments.map(p => new Date(p.paymentDate))));
  const nextDueDate = new Date(lastPaymentDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  
  return nextDueDate;
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