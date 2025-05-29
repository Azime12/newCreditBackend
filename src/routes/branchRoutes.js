const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/",authenticate, branchController.create);
router.get("/",authenticate, branchController.getAll);
router.get("/:id",authenticate, branchController.getOne);
router.put("/:id",authenticate, branchController.update);
router.delete("/:id",authenticate, branchController.remove);

module.exports = router;
