const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const LoanPayment = sequelize.define(
  "LoanPayment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    principalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    interestAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("cash", "bank_transfer", "mobile_money", "check", "other"),
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recordedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "reversed","rejected"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "loan_payments",
    timestamps: true,
    paranoid: true,
  }
);

// 👇 Associations
LoanPayment.associate = (models) => {
  LoanPayment.belongsTo(models.Loan, {
    foreignKey: "loanId",
    as: "loan",
  });

  LoanPayment.belongsTo(models.User, {
    foreignKey: "recordedBy",
    as: "recorder",
  });
};

module.exports = LoanPayment;
