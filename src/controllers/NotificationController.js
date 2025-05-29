const { sendNotification, getNotificationsByUser } = require("../services/notificaitonService");

const sendNotificationHandler = async (req, res) => {
  const { userId, type, data } = req.body;
  try {
    await sendNotification(userId, type, data);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotificationsHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await getNotificationsByUser(userId);
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendNotificationHandler, getNotificationsHandler };