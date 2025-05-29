const express = require("express");
const router = express.Router();
const loanTypeController = require("../controllers/loanTypeController");
const { authenticate } = require("../middlewares/authMiddleware");
router.use(authenticate)
router.post("/", loanTypeController.create);
router.get("/", loanTypeController.getAll);
router.get("/:id", loanTypeController.getById);
router.put("/:id", loanTypeController.update);
router.delete("/:id", loanTypeController.delete);
router.post("/:id/restore", loanTypeController.restore);
router.get("/stats/loan-types", loanTypeController.getLoanTypeStats);

module.exports = router;