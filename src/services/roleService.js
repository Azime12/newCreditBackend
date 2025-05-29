const Role = require("../models/roleModel");

// Create a new role
const createRole = async (name) => {
  try {
    if (!name) {
      throw new Error("Role name is required.");
    }

    // Check if the role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      throw new Error("Role with this name already exists.");
    }

    // Create the role
    const role = await Role.create({ name });
    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all roles
const getRoles = async () => {
  try {
    const roles = await Role.findAll();
    return roles;
  } catch (error) {
    throw new Error("Failed to fetch roles.");
  }
};

// Get a role by ID
const getRoleById = async (id) => {
  try {
    if (!id) {
      throw new Error("Role ID is required.");
    }

    const role = await Role.findByPk(id);
    if (!role) {
      throw new Error("Role not found.");
    }

    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a role by ID
const updateRole = async (id, name) => {
  try {
    if (!id || !name) {
      throw new Error("Role ID and name are required.");
    }

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      throw new Error("Role not found.");
    }

    // Update the role name
    role.name = name;
    await role.save();

    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a role by ID
const deleteRole = async (id) => {
  try {
    if (!id) {
      throw new Error("Role ID is required.");
    }

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      throw new Error("Role not found.");
    }

    // Delete the role
    await role.destroy();
    return { message: "Role deleted successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};