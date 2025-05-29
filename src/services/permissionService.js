const Permission = require("../models/permissionModel");

// Get a permission by name (to check for duplicates)
const getPermissionByName = async (name) => {
  return await Permission.findOne({ where: { name } });
};

// Create a new permission
const createPermission = async (name) => {
  return await Permission.create({ name });
};

// Get all permissions
const getPermissions = async () => {
  return await Permission.findAll(); // Corrected usage
};

// Get a permission by ID
const getPermissionById = async (id) => {
  return await Permission.findByPk(id);
};

// Update a permission by ID
const updatePermission = async (id, name) => {
  const permission = await Permission.findByPk(id);
  if (!permission) {
    throw new Error("Permission not found");
  }
  permission.name = name;
  await permission.save();
  return permission;
};

// Delete a permission by ID
const deletePermission = async (id) => {
  const permission = await Permission.findByPk(id);
  if (!permission) {
    throw new Error("Permission not found");
  }
  await permission.destroy();
  return { message: "Permission deleted successfully" };
};

module.exports = {
  deletePermission,
  createPermission,
  updatePermission,
  getPermissionById,
  getPermissions,
  getPermissionByName, // Added this function to fix the error
};
  