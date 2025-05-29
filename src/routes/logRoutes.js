const express = require("express");
const {
  getAllLogs,
  getLogsByUserId,
  getLogsByCategory,
  getLogsByDate,
} = require("../controllers/LogController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authenticate)
router.get("/", getAllLogs); // Get all logs (with pagination)
router.get("/user/:userId", getLogsByUserId); // Get logs by user ID
router.get("/category/:category", getLogsByCategory); // Get logs by category
router.get("/date", getLogsByDate); // Get logs filtered by date range

module.exports = router;
