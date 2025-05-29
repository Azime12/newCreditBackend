const { createTemplate, getTemplateById, getAllTemplates, updateTemplate, deleteTemplate } = require("../services/TemplateService");

const createTemplateHandler = async (req, res) => {
  const { type, subtype, template } = req.body;
  try {
    const newTemplate = await createTemplate(type, subtype, template);
    res.status(201).json({ template: newTemplate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTemplateHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await getTemplateById(id);
    res.status(200).json({ template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTemplatesHandler = async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.status(200).json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTemplateHandler = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedTemplate = await updateTemplate(id, updates);
    res.status(200).json({ template: updatedTemplate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTemplateHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTemplate(id);
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTemplateHandler, getTemplateHandler, getAllTemplatesHandler, updateTemplateHandler, deleteTemplateHandler };