const express = require("express");
const router = express.Router();

// Controllers
const roleController = require("../controllers/roleController");
const permissionController = require("../controllers/permissionController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userControllers");
const rolePermissionController = require("../controllers/rolePermissionController");

// Middleware
const {
  authenticate,
} = require("../middlewares/authMiddleware");

// 🔐 Admin User Registration
router.post("/register", authenticate, userController.adminUserRegister);

// 🔹 Role Management
router.post("/roles", authenticate, roleController.createRole);
router.get("/roles", authenticate, roleController.getRoles);
router.get("/roles/:id", authenticate, roleController.getRoleById);
router.put("/roles/:id", authenticate, roleController.updateRole);
router.delete("/roles/:id", authenticate, roleController.deleteRole);

// 🔹 Permission Management
router.post("/permissions", authenticate, permissionController.createPermission);
router.get("/permissions", authenticate, permissionController.getPermissions);
router.get("/permissions/:id", authenticate, permissionController.getPermissionById);
router.put("/permissions/:id", authenticate, permissionController.updatePermission);
router.delete("/permissions/:id", authenticate, permissionController.deletePermission);

// 🔹 User-Role-Permission Assignments
router.post("/assign-role", authenticate, authController.assignRoleToUser);
router.post("/assign-permission", authenticate, authController.assignPermissionToRole);

// 🔹 Advanced Role-Permission Mapping
router.post("/assign", authenticate, rolePermissionController.assignPermissionToRole);
router.delete(
  "/roles/:roleId/permissions/:permissionId",
  authenticate,
  rolePermissionController.removePermissionFromRole
);
router.get("/roles/:roleId/permissions", authenticate, rolePermissionController.getRolePermissions);
router.get("/all-permissions", authenticate, rolePermissionController.getAllPermissions);

module.exports = router;