const express = require('express');
const savingTypeController = require('../controllers/savingTypeController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Saving Type
 *     description: Endpoints related to managing saving types.
 */

/**
 * @swagger
 * /saving-types:
 *   post:
 *     tags:
 *       - Saving Type
 *     summary: Create a new saving type
 *     description: Add a new saving type to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the saving type
 *               description:
 *                 type: string
 *                 description: A brief description of the saving type
 *               interestRate:
 *                 type: number
 *                 format: float
 *                 description: Interest rate for the saving type
 *               minBalance:
 *                 type: number
 *                 format: float
 *                 description: Minimum balance for the saving type
 *               withdrawalLimit:
 *                 type: integer
 *                 description: Withdrawal limit for the saving type (null for no limit)
 *               tenureInMonths:
 *                 type: integer
 *                 description: Duration for the saving type in months (null for no duration)
 *               penaltyRate:
 *                 type: number
 *                 format: float
 *                 description: Penalty rate for premature withdrawals
 *     responses:
 *       201:
 *         description: Successfully created saving type
 *       500:
 *         description: Failed to create saving type
 */
router.post('/', savingTypeController.createSavingType);

/**
 * @swagger
 * /saving-types:
 *   get:
 *     tags:
 *       - Saving Type
 *     summary: Retrieve all saving types
 *     description: Fetch all saving types available in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved saving types
 *       500:
 *         description: Failed to retrieve saving types
 */
router.get('/', savingTypeController.getAllSavingTypes);

/**
 * @swagger
 * /saving-types/{id}:
 *   get:
 *     tags:
 *       - Saving Type
 *     summary: Retrieve saving type by ID
 *     description: Fetch a specific saving type by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the saving type
 *     responses:
 *       200:
 *         description: Successfully retrieved the saving type
 *       404:
 *         description: Saving type not found
 *       500:
 *         description: Failed to retrieve saving type
 */
router.get('/:id', savingTypeController.getSavingTypeById);

/**
 * @swagger
 * /saving-types/{id}:
 *   put:
 *     tags:
 *       - Saving Type
 *     summary: Update an existing saving type
 *     description: Update an existing saving type's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the saving type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the saving type
 *               description:
 *                 type: string
 *                 description: A brief description of the saving type
 *               interestRate:
 *                 type: number
 *                 format: float
 *                 description: Interest rate for the saving type
 *               minBalance:
 *                 type: number
 *                 format: float
 *                 description: Minimum balance for the saving type
 *               withdrawalLimit:
 *                 type: integer
 *                 description: Withdrawal limit for the saving type (null for no limit)
 *               tenureInMonths:
 *                 type: integer
 *                 description: Duration for the saving type in months (null for no duration)
 *               penaltyRate:
 *                 type: number
 *                 format: float
 *                 description: Penalty rate for premature withdrawals
 *     responses:
 *       200:
 *         description: Successfully updated saving type
 *       404:
 *         description: Saving type not found
 *       500:
 *         description: Failed to update saving type
 */
router.put('/:id', savingTypeController.updateSavingType);

/**
 * @swagger
 * /saving-types/{id}:
 *   delete:
 *     tags:
 *       - Saving Type
 *     summary: Delete a saving type
 *     description: Remove a saving type from the system by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the saving type to delete
 *     responses:
 *       200:
 *         description: Successfully deleted saving type
 *       404:
 *         description: Saving type not found
 *       500:
 *         description: Failed to delete saving type
 */
router.delete('/:id', savingTypeController.deleteSavingType);

module.exports = router;
