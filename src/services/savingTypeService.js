const SavingType = require("../models/SavingTypeModel");
const { Op } = require("sequelize");

// Create a new saving type
const createSavingType = async (data) => {
  // Check if a saving type with the same name exists
  const existingSavingType = await SavingType.findOne({ where: { name: data.name } });
  if (existingSavingType) {
    throw new Error("Saving type with this name already exists.");
  }

  return await SavingType.create(data);
};
  
// Get all saving types
const getAllSavingTypes = async () => {
  return await SavingType.findAll();
};

// Get a saving type by ID
const getSavingTypeById = async (id) => {
  const savingType = await SavingType.findByPk(id);
  if (!savingType) {
    throw new Error("Saving type not found.");
  }
  return savingType;
};


// Update a saving type
const updateSavingType = async (id, data) => {
  console.log("id",id,"data:",data);
  const savingTypeId = parseInt(id, 10); // Ensure ID is an integer

  if (isNaN(savingTypeId)) {
    throw new Error("Invalid ID format. ID must be a number.");
  }

  if(!data?.name){
    throw new Error("name of the saving type must enter .");
  }
  const savingType = await SavingType.findByPk(savingTypeId);
  if (!savingType) {
    throw new Error("Saving type not found.");
  }

  // Check for duplicate name (excluding current record)
  const existingSavingType = await SavingType.findOne({
    where: { 
      name: data.name, 
      id: { [Op.ne]: savingTypeId } // Fix incorrect condition
    },
  });

  if (existingSavingType) {
    throw new Error("A saving type with this name already exists.");
  }

  return await savingType.update(data);
};


// Delete a saving type
const deleteSavingType = async (id) => {
  const savingType = await SavingType.findByPk(id);
  if (!savingType) {
    throw new Error("Saving type not found.");
  }
  await savingType.destroy();
};

module.exports = {
  createSavingType,
  getAllSavingTypes,
  getSavingTypeById,
  updateSavingType,
  deleteSavingType,
};
