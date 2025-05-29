const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Loan = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loanNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    loanTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Links to LoanApplication if created from one
    },
    principalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    termMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    disbursementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "paid", "defaulted", "cancelled"),
      defaultValue: "pending",
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    lastPaymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "loans",
    timestamps: true,
    paranoid: true,
  }
);

// 👇 Setup associations
Loan.associate = (models) => {
  Loan.belongsTo(models.User, {
    foreignKey: "customerId",
    as: "customer",
  });

  Loan.belongsTo(models.LoanType, {
    foreignKey: "loanTypeId",
    as: "loanType",
  });

  Loan.belongsTo(models.LoanApplication, {
    foreignKey: "applicationId",
    as: "application",
  });

  Loan.hasMany(models.LoanPayment, {
    foreignKey: "loanId",
    as: "payments",
  });
};

module.exports = Loan;
