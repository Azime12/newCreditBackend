const express = require("express");
const { sendNotificationHandler, getNotificationsHandler } = require("../controllers/NotificationController");
const { createTemplateHandler, getTemplateHandler, getAllTemplatesHandler, updateTemplateHandler, deleteTemplateHandler } = require("../controllers/TemplateController");
const { setUserPreferenceHandler, getUserPreferencesHandler, updateUserPreferenceHandler, deleteUserPreferenceHandler } = require("../controllers/UserPreferenceController");
const router = express.Router();

router.post("/notify", sendNotificationHandler);
router.get("/notifications/:userId", getNotificationsHandler);
//templates
router.post("/templates", createTemplateHandler);
router.get("/templates/:id", getTemplateHandler);
router.get("/templates", getAllTemplatesHandler);
router.put("/templates/:id", updateTemplateHandler);
router.delete("/templates/:id", deleteTemplateHandler);
//preferencesbyuser
router.post("/preferences", setUserPreferenceHandler);
router.get("/preferences/:userId", getUserPreferencesHandler);
router.put("/preferences", updateUserPreferenceHandler);
router.delete("/preferences", deleteUserPreferenceHandler);

module.exports = router;