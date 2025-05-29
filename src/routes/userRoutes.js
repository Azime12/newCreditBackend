const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");

const {
  authenticate,
 
} = require("../middlewares/authMiddleware");
router.use(authenticate)
// User Controllers
const {
  changePassword,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  deleteUser,
  activateAndDeactivateUser,
  getVerifiedUsers,
  getUnverifiedUsers,
  searchUsersController,
  updateUser
} = require("../controllers/userControllers");
const  { assignRoleToUser } =require("../controllers/authController");

// Profile Controllers
const {
  createOrUpdateProfile,
  getProfile,
  patchProfile,
  getProfileCompletionStatus
} = require("../controllers/userProfileController");

// Apply authentication middleware to all routes
// router.use(authenticate);

// User Profile Routes
router.post(
  "/profile/:userId",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "idFrontPhoto", maxCount: 1 },
    { name: "idBackPhoto", maxCount: 1 }
  ]),
  createOrUpdateProfile
);

router.get("/profile/:userId", getProfile);
router.patch("/profile/:userId", patchProfile);
router.get("/profile/isComplete/:userId"  , getProfileCompletionStatus);

// User Management Routes
router.post("/change-password", changePassword);
router.post("/assign-rolt-to-user", assignRoleToUser);

router.get("/search", searchUsersController);
router.patch("/:userId",  updateUser);
router.get("/:userId",  getUserById);

// Admin-only routes
// router.use(authorizeRoles("Admin"));
router.get("/", getAllUsers);
router.get("/email/:email", getUserByEmail);
router.get("/phone/:phone", getUserByPhone);
router.delete("/:userId", deleteUser);
router.put("/:userId/status", activateAndDeactivateUser);
router.get("/verified", getVerifiedUsers);
router.get("/unverified", getUnverifiedUsers);

module.exports = router;