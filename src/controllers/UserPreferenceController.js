const { setUserPreference, getUserPreferences, updateUserPreference, deleteUserPreference } = require("../services/UserPreferenceService");

const setUserPreferenceHandler = async (req, res) => {
  const { userId, type, channel, enabled } = req.body;
  try {
    const preference = await setUserPreference(userId, type, channel, enabled);
    res.status(200).json({ preference });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserPreferencesHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const preferences = await getUserPreferences(userId);
    res.status(200).json({ preferences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserPreferenceHandler = async (req, res) => {
  const { userId, type, channel, enabled } = req.body;
  try {
    const preference = await updateUserPreference(userId, type, channel, enabled);
    res.status(200).json({ preference });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserPreferenceHandler = async (req, res) => {
  const { userId, type, channel } = req.body;
  try {
    const result = await deleteUserPreference(userId, type, channel);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { setUserPreferenceHandler, getUserPreferencesHandler, updateUserPreferenceHandler, deleteUserPreferenceHandler };