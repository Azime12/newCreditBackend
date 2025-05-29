const path = require("path");
const sequelize = require("../../config/database");

const User = require("../userModel");
const Branch =require("../branchModel");
const SavingAccount=require("../SavingsAccountModel");
const Loan = require("./loanModel");
const LoanType = require("./loanTypeModel");
const LoanApplication = require("./loanApplicationModel");
const LoanPayment = require("./loanPaymentModel");

const models = {
  User,
  Loan,
  LoanType,
  LoanApplication,
  LoanPayment,
  Branch,
  SavingAccount
};

// Setup associations if any model has .associate
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

const initializeModels = async () => {
  try {
    await sequelize.authenticate();
    console.log("🔗 Database connected successfully");

    await sequelize.sync({ alter: true }); // Change to `force: true` if needed
    console.log("✅ Models synchronized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize models:", error.message);
    throw error;
  }
};

module.exports = {
  ...models,
  sequelize,
  initializeModels,
};
