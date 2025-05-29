const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    transactionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fromAccountId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "saving_accounts",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    toAccountId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "saving_accounts",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    transactionReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "PENDING",
      validate: {
        isIn: [["PENDING", "COMPLETED", "FAILED"]],
      },
    },
    transactionMetadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    fee: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    initiatedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    initiatedFrom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    location: {
      type: DataTypes.STRING(50),
      defaultValue: "SYSTEM",
      validate: {
        isIn: [["TELLER", "SYSTEM"]],
      },
    },
    locationDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "transactions",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Transaction;
