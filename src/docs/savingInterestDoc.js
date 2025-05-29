const express = require("express");
const {
  getAllSavingInterests,
  getSavingInterestByAccountId,
  addInterest,  // Renamed from `calculateInterest` to `addInterest`
  deleteSavingInterest
} = require("../controllers/savingInterestController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Saving Interest
 *     description: Endpoints related to saving interest calculations.
 */

/**
 * @swagger
 * /saving-interest:
 *   get:
 *     tags:
 *       - Saving Interest
 *     summary: Retrieve all saving interest records
 *     description: Fetch all interest calculations stored in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved interest records
 *       500:
 *         description: Failed to retrieve interest records
 */
router.get("/", getAllSavingInterests);

/**
 * @swagger
 * /saving-interest/account/{savingAccountId}:
 *   get:
 *     tags:
 *       - Saving Interest
 *     summary: Retrieve interest records for a specific saving account
 *     description: Fetch all interest calculations related to a specific saving account.
 *     parameters:
 *       - in: path
 *         name: savingAccountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the saving account
 *     responses:
 *       200:
 *         description: Interest records retrieved successfully
 *       404:
 *         description: No interest records found for this account
 *       500:
 *         description: Error retrieving interest records
 */
router.get("/account/:savingAccountId", getSavingInterestByAccountId);

/**
 * @swagger
 * /saving-interest/add:
 *   post:
 *     tags:
 *       - Saving Interest
 *     summary: Calculate and store interest for a saving account
 *     description: Compute and store interest based on the account balance and interest rate.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - savingAccountId
 *               - interestRate
 *             properties:
 *               savingAccountId:
 *                 type: string
 *                 description: The ID of the saving account
 *               interestRate:
 *                 type: number
 *                 format: float
 *                 description: The interest rate percentage to apply
 *     responses:
 *       201:
 *         description: Interest calculated and stored successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       500:
 *         description: Error calculating interest
 */
router.post("/add", addInterest);

/**
 * @swagger
 * /saving-interest/{id}:
 *   delete:
 *     tags:
 *       - Saving Interest
 *     summary: Delete a specific interest record
 *     description: Remove an interest record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the interest record
 *     responses:
 *       200:
 *         description: Interest record deleted successfully
 *       404:
 *         description: Interest record not found
 *       500:
 *         description: Error deleting interest record
 */
router.delete("/:id", deleteSavingInterest);

module.exports = router;
