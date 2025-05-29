const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SavingRecommendation = sequelize.define(
    "SavingRecommendation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",  // Refers to the Users table
                key: "id",
            },
            onDelete: "CASCADE", // Deletes the recommendation if the user is deleted
        },
        recommendedPlan: {
            type: DataTypes.STRING(255),
            allowNull: true, // Optional, could be NULL if no recommendation
        },
        recommendedAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false, // Ensures recommended amount is required
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true, // Optional, could be NULL if no reason is provided
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Default timestamp when the recommendation is created
            allowNull: false,
        },
    },
    {
        tableName: "saving_recommendations", // Table name in the database
        timestamps: false, // Disable Sequelize's automatic timestamps (`createdAt`, `updatedAt`)
        underscored: true, // Use snake_case for column names
    }
);

module.exports = SavingRecommendation;
