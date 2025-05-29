const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const LoanType = sequelize.define(
  "LoanType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    min_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    max_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    payment_frequency: {
      type: DataTypes.ENUM("monthly", "weekly", "biweekly"),
      allowNull: false,
      defaultValue: "monthly",
    },
    min_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    max_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "loan_types",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// 👇 Associations
LoanType.associate = (models) => {
  LoanType.hasMany(models.Loan, {
    foreignKey: "loanTypeId",
    as: "loans",
  });

  LoanType.hasMany(models.LoanApplication, {
    foreignKey: "loanTypeId",
    as: "applications",
  });
};

module.exports = LoanType;
