const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const SavingAccount = require("./SavingsAccountModel"); // Import SavingAccount model

const SavingInterest = sequelize.define(
    "SavingInterest",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        savingAccountId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "saving_accounts", // Ensure it matches the SavingAccount table name
                key: "id",
            },
            onDelete: "CASCADE", // Delete interest when the associated account is deleted
        },
        interestEarned: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0.00, // Default interest value
        },
        calculationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Store when interest is calculated
        },
    },
    {
        tableName: "saving_interest", // Explicitly define the table name
        timestamps: false, // Disable createdAt and updatedAt
        underscored: true, // Use snake_case for column names
    }
);

// Define Associations
SavingInterest.belongsTo(SavingAccount, { foreignKey: "savingAccountId" });
SavingAccount.hasMany(SavingInterest, { foreignKey: "savingAccountId" }); // One account → Many interests

module.exports = SavingInterest;
