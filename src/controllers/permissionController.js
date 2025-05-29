const Joi = require("joi");
const permissionService = require("../services/permissionService");

// Validation schema for permission name
const permissionSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
});

// Create a new permission
const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    const { error } = permissionSchema.validate({ name });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if permission already exists
    const existingPermission = await permissionService.getPermissionByName(name);
    if (existingPermission) {
      return res.status(409).json({ message: "Permission already exists" });
    }

    const permission = await permissionService.createPermission(name);
    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = await permissionService.getPermissions();
    res.status(200).json({ permissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a permission by ID
const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required " });
    }

    const permission = await permissionService.getPermissionById(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(200).json({ permission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a permission by ID
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    const { error } = permissionSchema.validate({ name });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if permission exists
    const existingPermission = await permissionService.getPermissionById(id);
    if (!existingPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    // Check if another permission with the same name already exists
    const duplicatePermission = await permissionService.getPermissionByName(name);
    if (duplicatePermission && duplicatePermission.id !== id) {
      return res.status(409).json({ message: "Permission name already in use" });
    }

    const permission = await permissionService.updatePermission(id, name);
    res.status(200).json({ message: "Permission updated successfully", permission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a permission by ID
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is Requried" });
    }

    const existingPermission = await permissionService.getPermissionById(id);
    if (!existingPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await permissionService.deletePermission(id);
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
