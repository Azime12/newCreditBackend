const rolePermissionService = require('../services/rolePermissionService');

// Controller to assign permission to a role
const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      return res.status(400).json({ message: "Role ID and Permission ID are required" });
    }

    const result = await rolePermissionService.assignPermissionToRole(roleId, permissionId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to remove permission from a role
const removePermissionFromRole = async (req, res) => {
    try {
      const { roleId, permissionId } = req.params;
  
      console.log("roleId",roleId,"permission",permissionId)
      if (!roleId || !permissionId) {
        return res.status(400).json({ message: "Role ID and Permission ID are required" });
      }
  
      const result = await rolePermissionService.removePermissionFromRole(roleId, permissionId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

// Controller to get all permissions of a role
const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await rolePermissionService.getRolePermissions(roleId);
    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to get all permissions available
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await rolePermissionService.getAllPermissions();
    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
  getAllPermissions,
};
