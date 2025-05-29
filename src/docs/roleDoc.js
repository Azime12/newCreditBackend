const express = require("express");
const roleController = require("../controllers/roleController");
const permissionController = require("../controllers/permissionController");
const authController = require("../controllers/authController");

const router = express.Router();

if (!roleController.createRole || !permissionController.createPermission || !authController.assignRoleToUser || !authController.assignPermissionToRole) {
    throw new Error("One or more required controller functions are missing.");
}

/**
 * @swagger
 * tags:
 *   - name: Role & Permission Management
 *     description: Endpoints related to user roles and permissions.
 */

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     tags:
 *       - Role & Permission Management
 *     summary: Create a new role
 *     description: Allows an admin to create a new role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/roles", roleController.createRole);

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     tags:
 *       - Role & Permission Management
 *     summary: Retrieve all roles
 *     description: Fetch all available roles in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved roles
 *       500:
 *         description: Error retrieving roles
 */
router.get("/roles", roleController.getRoles);

/**
 * @swagger
 * /admin/roles/{id}:
 *   get:
 *     tags:
 *       - Role & Permission Management
 *     summary: Retrieve a role by ID
 *     description: Fetch a specific role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved role
 *       404:
 *         description: Role not found
 *       500:
 *         description: Error retrieving role
 */
router.get("/roles/:id", roleController.getRoleById);

/**
 * @swagger
 * /admin/roles/{id}:
 *   put:
 *     tags:
 *       - Role & Permission Management
 *     summary: Update a role by ID
 *     description: Allows an admin to update a role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.put("/roles/:id", roleController.updateRole);

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     tags:
 *       - Role & Permission Management
 *     summary: Delete a role by ID
 *     description: Allows an admin to delete a role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.delete("/roles/:id", roleController.deleteRole);

/**
 * @swagger
 * /admin/permissions:
 *   post:
 *     tags:
 *       - Role & Permission Management
 *     summary: Create a new permission
 *     description: Allows an admin to define new permissions in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "edit_user"
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/permissions", permissionController.createPermission);

/**
 * @swagger
 * /admin/permissions:
 *   get:
 *     tags:
 *       - Role & Permission Management
 *     summary: Retrieve all permissions
 *     description: Fetch all defined permissions in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved permissions
 *       500:
 *         description: Error retrieving permissions
 */
router.get("/permissions", permissionController.getPermissions);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   get:
 *     tags:
 *       - Role & Permission Management
 *     summary: Retrieve a permission by ID
 *     description: Fetch a specific permission by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The permission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Error retrieving permission
 */
router.get("/permissions/:id", permissionController.getPermissionById);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   put:
 *     tags:
 *       - Role & Permission Management
 *     summary: Update a permission by ID
 *     description: Allows an admin to update a permission by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The permission ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "edit_user"
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
router.put("/permissions/:id", permissionController.updatePermission);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   delete:
 *     tags:
 *       - Role & Permission Management
 *     summary: Delete a permission by ID
 *     description: Allows an admin to delete a permission by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The permission ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
router.delete("/permissions/:id", permissionController.deletePermission);

/**
 * @swagger
 * /admin/assign-role:
 *   post:
 *     tags:
 *       - Role & Permission Management
 *     summary: Assign a role to a user
 *     description: Assigns a specific role to a user by user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123456"
 *               roleId:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/assign-role", authController.assignRoleToUser);

/**
 * @swagger
 * /admin/assign-permission:
 *   post:
 *     tags:
 *       - Role & Permission Management
 *     summary: Assign a permission to a role
 *     description: Grants a specific permission to a role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "admin"
 *               permissionId:
 *                 type: string
 *                 example: "edit_user"
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/assign-permission", authController.assignPermissionToRole);

module.exports = router;
