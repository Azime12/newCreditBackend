const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import related models
const SavingType = require("./SavingTypeModel");
const AccountNumber = require("./AccountNumberModel");

const SavingAccount = sequelize.define(
    "SavingAccount",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
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
        accountNumberId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "account_numbers",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        savingTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "saving_types",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.00,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE", "CLOSED"),
            defaultValue: "ACTIVE",
            allowNull: false,
        },
    },
    {
        tableName: "saving_accounts",
        timestamps: true,
        underscored: true,
    }
);

// ✅ Define Associations (after model is declared)
SavingAccount.belongsTo(SavingType, { foreignKey: 'savingTypeId' });
SavingAccount.belongsTo(AccountNumber, { foreignKey: 'accountNumberId' });

SavingType.hasMany(SavingAccount, { foreignKey: 'savingTypeId' });
AccountNumber.hasMany(SavingAccount, { foreignKey: 'accountNumberId' });

module.exports = SavingAccount;
