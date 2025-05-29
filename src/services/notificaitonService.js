const { Notification, NotificationLog, User } = require("../models");
const sendEmail  = require("../utils/emailService");

const sendNotification = async (userId, type, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const message = `Notification: ${type}, Data: ${JSON.stringify(data)}`;

  try {
    if (data.channel === "email") {
      await sendEmail(user.email, "Notification", message);
    } else if (data.channel === "sms") {
      // Implement SMS logic here
    }

    const notification = await Notification.create({ userId, message, status: "sent", channel: data.channel });
    await NotificationLog.create({ notificationId: notification.id, status: "sent", details: "Notification sent successfully" });
  } catch (error) {
    const notification = await Notification.create({ userId, message, status: "failed", channel: data.channel });
    await NotificationLog.create({ notificationId: notification.id, status: "failed", details: error.message });
    throw error;
  }
};

const getNotificationsByUser = async (userId) => {
  return await Notification.findAll({ where: { userId } });
};

module.exports = { sendNotification, getNotificationsByUser };