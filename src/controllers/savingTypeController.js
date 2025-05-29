// controllers/savingTypeController.js
const savingTypeService = require('../services/savingTypeService');

exports.createSavingType = async (req, res) => {
  try {
    const newSavingType = await savingTypeService.createSavingType(req.body);
    return res.status(201).json({
      message: 'Saving Type created successfully',
      data: newSavingType,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllSavingTypes = async (req, res) => {
  try {
    const savingTypes = await savingTypeService.getAllSavingTypes();
    return res.status(200).json(savingTypes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSavingTypeById = async (req, res) => {
  // console.log("saving t req:",req)
  try {
    const savingType = await savingTypeService.getSavingTypeById(req.params.id);
    return res.status(200).json(savingType);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateSavingType = async (req, res) => {
  try {
    const updatedSavingType = await savingTypeService.updateSavingType(req.params.id, req.body);
    return res.status(200).json({
      message: 'Saving Type updated successfully',
      data: updatedSavingType,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteSavingType = async (req, res) => {
  try {
    await savingTypeService.deleteSavingType(req.params.id);
    return res.status(200).json({ message: 'Saving Type deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
