const {
  upsertUserProfile,
  getUserProfileByUserId,
  updateUserProfile,
  checkProfileCompletion
} = require("../services/userProfileService");
const { userProfileSchema, updateProfileSchema } = require("../validators/profileValidator");


const path = require("path");

const BASE_URL = "http://localhost:5000/"; // Change to backend URL (localhost:5000 in dev)


const createOrUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    let profileData = req.body;

    // 🔧 Fix: Parse address string to object if necessary
    if (typeof profileData.address === 'string') {
      try {
        profileData.address = JSON.parse(profileData.address);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(d => d.message),
        });
              }
    }

    // Check if files were uploaded and assign URLs
    if (req.files) {
      if (req.files.profilePhoto) {
        profileData.profilePhoto = `${BASE_URL}${path.relative("uploads", req.files.profilePhoto[0].path).replace(/\\/g, "/")}`;
      }
      if (req.files.idFrontPhoto) {
        profileData.idFrontPhoto = `${BASE_URL}${path.relative("uploads", req.files.idFrontPhoto[0].path).replace(/\\/g, "/")}`;
      }
      if (req.files.idBackPhoto) {
        profileData.idBackPhoto = `${BASE_URL}${path.relative("uploads", req.files.idBackPhoto[0].path).replace(/\\/g, "/")}`;
      }
    }
    

    // Validate the profile data using Joi
    const { error, value } = userProfileSchema.validate(profileData, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

    // Upsert the user profile in the database
    const profile = await upsertUserProfile(userId, value);
    res.status(200).json(profile);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getUserProfileByUserId(userId);
    res.status(200).json(profile);
  } catch (error) {
    if (error.message === "User profile not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};



const patchProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    let updates = req.body;

    // Handle file uploads and return the file URLs
    if (req.files) {
      if (req.files.profilePhoto) {
        profileData.profilePhoto = `${BASE_URL}${path.relative("uploads", req.files.profilePhoto[0].path).replace(/\\/g, "/")}`;
      }
      if (req.files.idFrontPhoto) {
        profileData.idFrontPhoto = `${BASE_URL}${path.relative("uploads", req.files.idFrontPhoto[0].path).replace(/\\/g, "/")}`;
      }
      if (req.files.idBackPhoto) {
        profileData.idBackPhoto = `${BASE_URL}${path.relative("uploads", req.files.idBackPhoto[0].path).replace(/\\/g, "/")}`;
      }
    }
    

    // Validate the updates using Joi
    const { error, value } = updateProfileSchema.validate(updates, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

    // Update the user profile in the database
    const updatedProfile = await updateUserProfile(userId, value);
    res.status(200).json(updatedProfile);
  } catch (err) {
    const code = err.message === "User profile not found" ? 404 : 500;
    res.status(code).json({ message: err.message });
  }
};


const getProfileCompletionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const status = await checkProfileCompletion(userId);
    res.status(200).json(status);
  } catch (error) {
    if (error.message === "User profile not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfile,
  patchProfile,
  getProfileCompletionStatus
};