const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../middlewares/authMiddleware");
router.use(authenticate);
router.post("/", transactionController.createTransaction); // Create a new transaction
router.get("/:userId", transactionController.getTransactionsByUser); // Get transactions by userId
router.put("/:transactionId/status", transactionController.updateTransactionStatus); // Update transaction status

module.exports = router;
