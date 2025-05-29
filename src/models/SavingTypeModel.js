const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SavingType = sequelize.define(
    "SavingType",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false, // Ensures that the name is required
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true, // This field is optional
        },
        interestRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false, // Required for the saving type
        },
        minBalance: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.00, // Default minimum balance
            allowNull: false,
        },
        withdrawalLimit: {
            type: DataTypes.INTEGER,
            defaultValue: null, // NULL means unlimited withdrawals
            allowNull: true,
        },
        tenureInMonths: {
            type: DataTypes.INTEGER,
            defaultValue: null, // For fixed/recurring deposits, this field can be NULL
            allowNull: true,
        },
        penaltyRate: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00, // Default penalty rate
            allowNull: false, // It's important to set a default value for penalty
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    },
    {
        tableName: "saving_types", // Table name in the database
        timestamps: false, // Disable timestamps since you manually define `createdAt`
        underscored: true, // Use snake_case for column names
    }
);

module.exports = SavingType;
