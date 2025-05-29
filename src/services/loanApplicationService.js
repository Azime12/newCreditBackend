const { LoanApplication, LoanType, User, Loan } = require('../models/loan');
const { Op } = require('sequelize');
const { generateApplicationNumber } = require('../utils/generateApplicationNumber');


/**
 * Create a new loan application
 * @param {Object} applicationData - Loan application data
 * @returns {Promise<LoanApplication>} Created loan application
 */
const createLoanApplication = async (applicationData) => {
  try {
    const loanType = await LoanType.findByPk(applicationData.loanTypeId);
    if (!loanType) {
      throw new Error("Invalid loan type ID. Loan type does not exist.");
    }

    const customer = await User.findByPk(applicationData.customerId);
    if (!customer) {
      throw new Error("Invalid customer ID. Customer does not exist.");
    }

    if (applicationData.principalAmount < loanType.min_amount || 
        applicationData.principalAmount > loanType.max_amount) {
      throw new Error(`Principal amount must be between ${loanType.min_amount} and ${loanType.max_amount}`);
    }

    if (applicationData.termMonths < loanType.min_term || 
        applicationData.termMonths > loanType.max_term) {
      throw new Error(`Loan term must be between ${loanType.min_term} and ${loanType.max_term} months`);
    }

    const applicationNumber = generateApplicationNumber();

    const application = await LoanApplication.create({
      ...applicationData,
      applicationNumber,
      status: "pending",
    });

    return application;
  } catch (error) {
    console.error("Error creating loan application:", error);
    throw error;
  }
};

/**
 * Get all loan applications for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array<LoanApplication>>} List of loan applications
 */
const getLoanApplicationsByUser = async (userId) => {
  try {
    const applications = await LoanApplication.findAll({
      where: { customerId: userId },
      include: [
        {
          model: LoanType,
          as: "loanType",
          attributes: ["id", "name", "interest_rate", "min_amount", "max_amount", "min_term", "max_term"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return applications;
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    throw new Error("Failed to fetch loan applications");
  }
};

/**
 * @param {number} id - Loan application ID
 * @returns {Promise<LoanApplication>} Loan application details
 */
const getLoanApplicationById = async (id) => {
  try {
    const application = await LoanApplication.findByPk(id, {
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: LoanType,
          as: "loanType",
          attributes: ["id", "name", "interest_rate", "min_amount", "max_amount", "min_term", "max_term"],
        },
        {
          model: User,
          as: "decisionMaker",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!application) {
      throw new Error("Loan application not found");
    }

    return application;
  } catch (error) {
    console.error("Error fetching loan application:", error);
    throw error;
  }
};

/**
 * Update loan application details
 * @param {number} id - Loan application ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<LoanApplication>} Updated loan application
 */

const updateLoanApplication = async (id, updateData) => {
  try {
    const application = await LoanApplication.findByPk(id);
    if (!application) {
      throw new Error("Loan application not found");
    }

    if (application.status !== "pending") {
      throw new Error("Only pending applications can be updated");
    }

    const updatedApplication = await application.update(updateData);
    return updatedApplication;
  } catch (error) {
    console.error("Error updating loan application:", error);
    throw error;
  }
};

/**
 * Update loan application status
 * @param {number} id - Loan application ID
 * @param {Object} statusData - Status update data
 * @returns {Promise<LoanApplication>} Updated loan application
 */
const updateLoanApplicationStatus = async (id, { status, decisionBy, comments }) => {
  try {
    const application = await LoanApplication.findByPk(id);
    if (!application) throw new Error("Loan application not found.");
    if (application.status !== "pending") throw new Error("Only pending applications can be updated.");

    const decision = {
      status,
      decidedAt: new Date(),
      decidedBy: decisionBy,
      comments: comments || null,
    };

    const updated = await application.update({
      status,
      finalDecision: decision,
      finalDecisionDate: decision.decidedAt,
      decisionBy: decision.decidedBy,
      decisionHistory: [...(application.decisionHistory || []), decision],
    });

    // If approved, create the loan
    if (status === "approved") {
      await createLoanFromApplication(application);
    }

    return updated;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

/**
 * Delete a loan application
 * @param {number} id - Loan application ID
 * @returns {Promise<void>}
 */
const deleteLoanApplication = async (id) => {
  try {
    const application = await LoanApplication.findByPk(id);
    if (!application) {
      throw new Error("Loan application not found.");
    }

    if (application.status !== "pending") {
      throw new Error("Only pending applications can be deleted.");
    }

    await application.destroy();
  } catch (error) {
    console.error("Error deleting loan application:", error);
    throw error;
  }
};

/**
 * Restore a deleted loan application
 * @param {number} id - Loan application ID
 * @returns {Promise<LoanApplication>} Restored loan application
 */
const restoreLoanApplication = async (id) => {
  try {
    const application = await LoanApplication.findOne({
      where: { id },
      paranoid: false,
    });

    if (!application) {
      throw new Error("Loan application not found");
    }

    await application.restore();
    return application;
  } catch (error) {
    console.error("Error restoring loan application:", error);
    throw error;
  }
};

/**
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated loan applications
 */
const getAllLoanApplications = async () => {
  try {
    const applications = await LoanApplication.findAll({
      include: [
        { 
          model: User, 
          as: "customer", 
          attributes: ["id", "firstName", "lastName", "email"] 
        },
        { 
          model: LoanType, 
          as: "loanType",
          attributes: ["id", "name", "interest_rate"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    return applications;
  } catch (error) {
    console.error("Error fetching all loan applications:", error);
    throw error;
  }
};
/**
 * Helper function to create loan from approved application
 * @param {LoanApplication} application - Approved loan application
 * @returns {Promise<Loan>} Created loan
 */
const generateLoanNumber = async () => {
  // Generate a unique loan number (e.g., LN-YYYYMMDD-XXXXX)
  const prefix = 'LN';
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${datePart}-${randomPart}`;
};



const createLoanFromApplication = async (application) => {
  try {
    const loanType = await LoanType.findByPk(application.loanTypeId);
    if (!loanType) {
      throw new Error('Loan type not found');
    }

    // Calculate interest and payments
    const interestRate = parseFloat(loanType.interest_rate) / 100;
    const monthlyInterest = interestRate / 12;
    const principal = parseFloat(application.principalAmount);
    
    // Amortization formula for monthly payment
    const monthlyPayment = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, application.termMonths)) /
      (Math.pow(1 + monthlyInterest, application.termMonths) - 1);
    
    const totalPayment = monthlyPayment * application.termMonths;
    const totalInterest = totalPayment - principal;

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(new Date().setMonth(startDate.getMonth() + application.termMonths));
    const disbursementDate = new Date();
    const dueDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

    // Create the loan record
    const loan = await Loan.create({
      loanNumber: await generateLoanNumber(),
      applicationId: application.id,
      customerId: application.customerId,
      loanTypeId: application.loanTypeId,
      
      // Financial details
      principalAmount: principal,
      interestRate: interestRate,
      termMonths: application.termMonths,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)), // Ensure 2 decimal places
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      balance: principal, // Initial balance equals principal
      
      // Dates
      startDate: startDate,
      endDate: endDate,
      disbursementDate: disbursementDate,
      dueDate: dueDate,
      lastPaymentDate: null, // No payments yet
      
      // Status
      status: "active",
      
      // References
      branch_id: application.branch_id,
    });

    return loan;
  } catch (error) {
    console.error('Error creating loan from application:', error);
    throw error;
  }
};

module.exports = {
  createLoanApplication,
  getLoanApplicationsByUser,
  getLoanApplicationById,
  updateLoanApplication,
  updateLoanApplicationStatus,
  deleteLoanApplication,
  restoreLoanApplication,
  getAllLoanApplications
};