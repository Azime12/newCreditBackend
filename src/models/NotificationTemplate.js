const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NotificationTemplate = sequelize.define(
  "NotificationTemplate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    template: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = NotificationTemplate;