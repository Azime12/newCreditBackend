const SystemSetting = require("../models/systemSettingModel");

exports.getSettings = async () => {
  const setting = await SystemSetting.findOne();
  return setting;
};

exports.updateSettings = async (data) => {
  let setting = await SystemSetting.findOne();
  if (!setting) {
    setting = await SystemSetting.create(data);
  } else {
    await setting.update(data);
  }
  return setting;
};
