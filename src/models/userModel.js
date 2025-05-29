const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { encryptData, decryptData } = require("../utils/cryptoUtils");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("firstName", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("firstName"));
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("lastName", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("lastName"));
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", encryptData(value.toLowerCase()));
      },
      get() {
        return decryptData(this.getDataValue("email"));
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      set(value) {
        if (value) {
          this.setDataValue("phoneNumber", encryptData(value));
        } else {
          this.setDataValue("phoneNumber", null);
        }
      },
      get() {
        const encryptedPhoneNumber = this.getDataValue("phoneNumber");
        if (encryptedPhoneNumber) {
          return decryptData(encryptedPhoneNumber);
        }
        return null;
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("Customer", "Admin", "LoanOfficer", "Accountant"),
      defaultValue: "Customer",
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;