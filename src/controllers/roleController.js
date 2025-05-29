// roleController.js
const Role = require("../models/roleModel");
const { roleSchema } = require("../validators/roleValidators");

// Create a new role
const createRole = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = roleSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Validation error", errors: errorMessages });
    }

    const { name } = value;

    // Check if the role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists." });
    }

    // Create the role
    const role = await Role.create({ name });
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "Role ID is required." });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    res.status(200).json({ role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a role by ID
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = roleSchema.validate(req.body, { abortEarly: false });
    console.log("Incoming body:", req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Validation error", errors: errorMessages });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    role.name = value.name;
    await role.save();

    res.status(200).json({
      message: "Role updated successfully",
      role: {
        id: role.id,
        name: role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a role by ID
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "Role ID is required." });
    }

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Delete the role
    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};