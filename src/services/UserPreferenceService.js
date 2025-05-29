const { UserNotificationPreference } = require("../models");

const setUserPreference = async (userId, type, channel, enabled) => {
  const [preference, created] = await UserNotificationPreference.findOrCreate({
    where: { userId, type, channel },
    defaults: { enabled },
  });

  if (!created) {
    // Update existing preference
    preference.enabled = enabled;
    await preference.save();
  }

  return preference;
};

const getUserPreferences = async (userId) => {
  return await UserNotificationPreference.findAll({ where: { userId } });
};

const updateUserPreference = async (userId, type, channel, enabled) => {
  const preference = await UserNotificationPreference.findOne({ where: { userId, type, channel } });
  if (!preference) throw new Error("Preference not found");

  preference.enabled = enabled;
  await preference.save();
  return preference;
};

const deleteUserPreference = async (userId, type, channel) => {
  const preference = await UserNotificationPreference.findOne({ where: { userId, type, channel } });
  if (!preference) throw new Error("Preference not found");

  await preference.destroy();
  return { message: "Preference deleted successfully" };
};

module.exports = { setUserPreference, getUserPreferences, updateUserPreference, deleteUserPreference };