const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const LoanApplication = sequelize.define(
  "LoanApplication",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    loanTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    principalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    termMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled"),
      defaultValue: "pending",
    },
    decisionHistory: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    finalDecision: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    finalDecisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
     branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
 
  },
  {
    tableName: "loan_applications",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// 👇 Associations go here
LoanApplication.associate = (models) => {
  // Belongs to customer
  LoanApplication.belongsTo(models.User, {
    foreignKey: "customerId",
    as: "customer",
  });

  // Belongs to loan type
  LoanApplication.belongsTo(models.LoanType, {
    foreignKey: "loanTypeId",
    as: "loanType",
  });

  // Belongs to decision maker (user)
  LoanApplication.belongsTo(models.User, {
    foreignKey: "decisionBy",
    as: "decisionMaker",
  });

  // Has one approved loan
  LoanApplication.hasOne(models.Loan, {
    foreignKey: "applicationId",
    as: "approvedLoan",
  });
    // Belongs to branch
  LoanApplication.belongsTo(models.Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  // Belongs to saving account
  LoanApplication.belongsTo(models.SavingAccount, {
    foreignKey: "saving_account_id",
    as: "savingAccount",
  });
};

module.exports = LoanApplication;
