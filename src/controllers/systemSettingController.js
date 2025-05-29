const service = require("../services/systemSettingService");
const { settingSchema } = require("../validators/systemSettingValidation");

exports.getSettings = async (req, res) => {
  try {
    const result = await service.getSettings();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch system settings", error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { error } = settingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updated = await service.updateSettings(req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update system settings", error: err.message });
  }
};
