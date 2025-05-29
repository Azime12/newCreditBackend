const Role = require('../models/roleModel'); // Import your models
const Permission =require("../models/permissionModel")
const { Op } = require('sequelize');

// Assign permission to a role
const assignPermissionToRole = async (roleId, permissionId) => {
  const role = await Role.findByPk(roleId);
  const permission = await Permission.findByPk(permissionId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (!permission) {
    throw new Error("Permission not found");
  }

  // Check if the permission is already assigned to the role
  const existingRolePermission = await role.hasPermission(permission);
  if (existingRolePermission) {
    throw new Error("Permission is already assigned to this role");
  }

  // Assign permission to the role
  await role.addPermission(permission);
  return { message: "Permission assigned successfully" };
};

// Remove permission from a role
const removePermissionFromRole = async (roleId, permissionId) => {
    console.log("roleId",roleId,"permission",permissionId)

  const role = await Role.findByPk(roleId);
  const permission = await Permission.findByPk(permissionId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (!permission) {
    throw new Error("Permission not found");
  }

  // Remove permission from the role
  await role.removePermission(permission);
  return { message: "Permission removed successfully" };
};


const getRolePermissions = async (roleId) => {
  const role = await Role.findByPk(roleId, {
    include: [{
      model: Permission,
      as: 'permissions',
      attributes: ['id', 'name'], // only include specific fields
      through: {
        attributes: [] // exclude RolePermission fields
      }
    }],
    attributes: ['id', 'name'] // include role id and name only
  });

  if (!role) {
    throw new Error("Role not found");
  }

  return {
    roleId: role.id,
    roleName: role.name,
    permissions: role.permissions.map(permission => ({
      id: permission.id,
      name: permission.name
    }))
  };
};


  
// Get all available permissions
const getAllPermissions = async () => {
  return await Permission.findAll();
};

module.exports = {
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
  getAllPermissions,
};
