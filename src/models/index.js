const sequelize = require("../config/database");
const User = require("./userModel");
const NotificationTemplate = require("./NotificationTemplate");
const Notification = require("./Notification");
const UserNotificationPreference = require("./UserNotificationPreference");
const NotificationLog = require("./NotificationLog");

// Define relationships
User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(UserNotificationPreference, { foreignKey: "userId" });
UserNotificationPreference.belongsTo(User, { foreignKey: "userId" });

NotificationTemplate.hasMany(Notification, { foreignKey: "templateId" });
Notification.belongsTo(NotificationTemplate, { foreignKey: "templateId" });

Notification.hasMany(NotificationLog, { foreignKey: "notificationId" });
NotificationLog.belongsTo(Notification, { foreignKey: "notificationId" });

module.exports = {
  sequelize,
  User,
  NotificationTemplate,
  Notification,
  UserNotificationPreference,
  NotificationLog,
};