const express = require("express");
const router = express.Router();
const savingInterestController = require("../controllers/savingInterestController");
const { authenticate } = require("../middlewares/authMiddleware");

router.use(authenticate)
// Add interest to a saving account
router.post("/add", savingInterestController.addInterest);

// Get all interests for a specific account
router.get("/:savingAccountId", savingInterestController.getInterestsByAccount);

// Get all interest records
router.get("/", savingInterestController.getAllInterests);

module.exports = router;
