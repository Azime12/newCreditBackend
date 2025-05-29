const express = require("express");
const branchController = require("../controllers/branchController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Branch Management
 *     description: API endpoints for managing branches of the saving and credit loan corporation.
 */

/**
 * @swagger
 * /branches:
 *   post:
 *     tags:
 *       - Branch Management
 *     summary: Create a new branch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchCode
 *               - branchName
 *               - address
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *               - phone
 *               - email
 *               - openingDate
 *             properties:
 *               branchCode:
 *                 type: string
 *               branchName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               openingDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, closed]
 *               managerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", branchController.create);

/**
 * @swagger
 * /branches:
 *   get:
 *     tags:
 *       - Branch Management
 *     summary: Get all branches
 *     responses:
 *       200:
 *         description: Successfully retrieved branches
 *       500:
 *         description: Failed to retrieve branches
 */
router.get("/", branchController.getAll);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     tags:
 *       - Branch Management
 *     summary: Get a branch by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The branch ID
 *     responses:
 *       200:
 *         description: Successfully retrieved branch
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Failed to retrieve branch
 */
router.get("/:id", branchController.getOne);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     tags:
 *       - Branch Management
 *     summary: Update a branch
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchCode:
 *                 type: string
 *               branchName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               openingDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, closed]
 *               managerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", branchController.update);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     tags:
 *       - Branch Management
 *     summary: Delete a branch (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The branch ID
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Failed to delete branch
 */
router.delete("/:id", branchController.remove);

module.exports = router;
