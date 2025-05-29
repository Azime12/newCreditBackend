const express = require("express");
const router = express.Router();
const accountNumberController = require("../controllers/accountNumberController");
const {authenticate}=require("../middlewares/authMiddleware")

router.post("/", accountNumberController.createAccountNumber);
router.get("/user/:userId", accountNumberController.getAccountNumbersByUser);
router.get("/:accountId", accountNumberController.getAccountNumberById);
router.delete("/:accountId", accountNumberController.deleteAccountNumber);

module.exports = router;
