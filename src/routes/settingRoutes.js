const express = require("express");
const router = express.Router();
const controller = require("../controllers/systemSettingController");
const { authenticate } = require("../middlewares/authMiddleware");

router.use(authenticate);
router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);

module.exports = router;
