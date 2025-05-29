const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { encryptData, decryptData } = require("../utils/cryptoUtils");
const User = require("./userModel");

const Branch = sequelize.define(
  "Branch",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("branchName", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("branchName"));
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("address", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("address"));
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("city", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("city"));
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("state", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("state"));
      },
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("postalCode", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("postalCode"));
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "United States",
      set(value) {
        this.setDataValue("country", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("country"));
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("phone", encryptData(value));
      },
      get() {
        return decryptData(this.getDataValue("phone"));
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("email", encryptData(value.toLowerCase())); // Store as lowercase
      },
      get() {
        return decryptData(this.getDataValue("email"));
      },
    },
    openingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "closed"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
    paranoid: true, // Enable soft deletion
  }
);

// Define associations
Branch.belongsTo(User, {
  foreignKey: "managerId",
  as: "manager",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

User.hasMany(Branch, {
  foreignKey: "managerId",
  as: "managedBranches",
});

module.exports = Branch;