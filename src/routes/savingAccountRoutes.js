const express = require("express");
const router = express.Router();
const savingAccountController = require("../controllers/savingAccountController");
const { authenticate } = require("../middlewares/authMiddleware");

// Apply authentication middleware to all routes

router.use(authenticate)
// Account Management Routes
router.post(
    "/",
    savingAccountController.createAccount
);
router.get("/user/:userId", savingAccountController.getUserAccounts);

router.get(
    "/",
    savingAccountController.getAllAccounts
);

router.get(
    "/user",
    savingAccountController.getUserAccounts
);

router.get(
    "/:accountId",
    savingAccountController.getAccountDetails
);

router.put(
    "/status",
    savingAccountController.updateStatus
);

// Financial Operations Routes
router.post(
    "/deposit",
    savingAccountController.deposit
);

router.post(
    "/withdraw",
    savingAccountController.withdraw
);

router.post(
    "/transfer",
    savingAccountController.transfer
);

// Account Information Routes
router.get(
    "/:accountId/balance",
    savingAccountController.getBalance
);

router.get(
    "/:accountId/transactions",
    savingAccountController.getTransactions
);

// Admin-only Routes
router.post(
    "/:accountId/calculate-interest",
    savingAccountController.calculateAccountInterest
);

module.exports = router;