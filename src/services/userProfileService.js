const UserProfile = require("../models/profileModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

const isProfileComplete = (profile) => {
  if (!profile) return false;
  
  const requiredFields = [
    "address",
    "profilePhoto",
    "idType",
    "idNumber",
    "idFrontPhoto",
    "idBackPhoto",
    "dateOfBirth"
  ];
  
  return requiredFields.every(field => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  });
};

const upsertUserProfile = async (userId, profileData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Parse address if it's a string
  if (profileData.address && typeof profileData.address === 'string') {
    try {
      profileData.address = JSON.parse(profileData.address);
    } catch (error) {
      throw new Error("Invalid address format. Must be valid JSON");
    }
  }

  // Check if the ID number exists for another user
  const existingProfile = await UserProfile.findOne({
    where: { idNumber: profileData.idNumber, userId: { [Op.ne]: userId } }
  });

  if (existingProfile) {
    throw new Error(` ID number already exit please try use other Id Number `);
  }

  const [profile, created] = await UserProfile.findOrCreate({
    where: { userId },
    defaults: profileData
  });

  if (!created) {
    await profile.update(profileData);
  }

  // Check profile completeness
  const updatedProfile = await UserProfile.findOne({ where: { userId } });
  const profileCompleted = isProfileComplete(updatedProfile);

  if (updatedProfile.profileCompleted !== profileCompleted) {
    await updatedProfile.update({ profileCompleted });
  }

  return updatedProfile;
};

const getUserProfileByUserId = async (userId) => {
  const profile = await UserProfile.findOne({ where: { userId } });
  if (!profile) throw new Error("User profile not found");
  return profile;
};

const updateUserProfile = async (userId, updates) => {
  const profile = await UserProfile.findOne({ where: { userId } });
  if (!profile) throw new Error("User profile not found");
  if (updates.idNumber && updates.idNumber !== profile.idNumber) {
    const existingProfile = await UserProfile.findOne({
      where: { idNumber: updates.idNumber, userId: { [Op.ne]: userId } }
    });

    if (existingProfile) {
      throw new Error(`A profile with this ID number already exists.`);
    }
  }
  // Parse address if it's a string
  if (updates.address && typeof updates.address === 'string') {
    try {
      updates.address = JSON.parse(updates.address);
    } catch (error) {
      throw new Error("Invalid address format. Must be valid JSON");
    }
  }

  await profile.update(updates);

  // Check profile completeness
  const updatedProfile = await profile.reload();
  const profileCompleted = isProfileComplete(updatedProfile);
  
  if (updatedProfile.profileCompleted !== profileCompleted) {
    await updatedProfile.update({ profileCompleted });
  }

  return updatedProfile;
};

const checkProfileCompletion = async (userId) => {
  const profile = await UserProfile.findOne({ where: { userId } });
  if (!profile) throw new Error("User profile not found");
  
  return {
    profileCompleted: isProfileComplete(profile)
  };
};

module.exports = {
  upsertUserProfile,
  getUserProfileByUserId,
  updateUserProfile,
  checkProfileCompletion,
  isProfileComplete
};