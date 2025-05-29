const { NotificationTemplate } = require("../models");

const createTemplate = async (type, subtype, template) => {
  return await NotificationTemplate.create({ type, subtype, template });
};

const getTemplateById = async (id) => {
  return await NotificationTemplate.findByPk(id);
};

const getAllTemplates = async () => {
  return await NotificationTemplate.findAll();
};

const updateTemplate = async (id, updates) => {
  const template = await NotificationTemplate.findByPk(id);
  if (!template) throw new Error("Template not found");
  return await template.update(updates);
};

const deleteTemplate = async (id) => {
  const template = await NotificationTemplate.findByPk(id);
  if (!template) throw new Error("Template not found");
  return await template.destroy();
};

module.exports = { createTemplate, getTemplateById, getAllTemplates, updateTemplate, deleteTemplate };