const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AccountNumber = sequelize.define(
    "AccountNumber",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            allowNull: false,
            primaryKey: true,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
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
    },
    {
        tableName: "account_numbers",
        timestamps: true, 
        underscored: true, 
    }
);

module.exports = AccountNumber;
