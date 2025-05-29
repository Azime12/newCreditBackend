const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { encryptData, decryptData } = require("../utils/cryptoUtils");

const SystemSetting = sequelize.define("SystemSetting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue("companyName", encryptData(val));
    },
    get() {
      return decryptData(this.getDataValue("companyName"));
    },
  },
  brandColor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: "UTC",
  },
  interestRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  creditLimit: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  minSavingAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  allowOverdraft: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  penaltyRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  withdrawalLockDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  autoApproveCredits: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = SystemSetting;
