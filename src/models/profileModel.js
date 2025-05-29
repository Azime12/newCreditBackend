const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");

const UserProfile = sequelize.define(
  "UserProfile",
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
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
     
  
    },
    idFrontPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idBackPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kycVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Marks if KYC verification is completed",
    },
    manualVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Marks if an employee has approved the verification",
    },
    identityVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "User is verified only if both KYC and manual verification are completed",
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Stores the ID of the employee who manually verified the user.",
    },
    verificationTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "The time when the user was fully verified.",
    },
    kycProvider: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "If KYC is used, stores the provider name.",
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserProfile;
