const express = require("express");
const {
  getAllLogs,
  getLogsByUserId,
  getLogsByCategory,
  getLogsByDate,
} = require("../controllers/LogController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Log Activity
 *     description: Endpoints related to user activity logging.
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     tags:
 *       - Log Activity
 *     summary: Retrieve all user activity logs
 *     description: Fetch all logs with optional pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default = 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs per page (default = 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved logs
 *       500:
 *         description: Failed to retrieve logs
 */
router.get("/", getAllLogs);

/**
 * @swagger
 * /logs/user/{userId}:
 *   get:
 *     tags:
 *       - Log Activity
 *     summary: Retrieve logs by user ID
 *     description: Fetch all activity logs associated with a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the user
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       404:
 *         description: No logs found for this user
 *       500:
 *         description: Error retrieving logs
 */
router.get("/user/:userId", getLogsByUserId);

/**
 * @swagger
 * /logs/category/{category}:
 *   get:
 *     tags:
 *       - Log Activity
 *     summary: Retrieve logs by category
 *     description: Fetch logs filtered by category, such as AUTHENTICATION or TRANSACTION.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Log category (e.g., AUTHENTICATION, TRANSACTION)
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       404:
 *         description: No logs found for this category
 *       500:
 *         description: Error retrieving logs
 */
router.get("/category/:category", getLogsByCategory);

/**
 * @swagger
 * /logs/date:
 *   get:
 *     tags:
 *       - Log Activity
 *     summary: Retrieve logs by date range
 *     description: Fetch logs recorded within a specified date range.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       400:
 *         description: Start date and end date are required
 *       500:
 *         description: Error retrieving logs
 */
router.get("/date", getLogsByDate);

module.exports = router;
