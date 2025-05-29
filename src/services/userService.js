const User = require("../models/userModel");
const { encryptData, decryptData } = require("../utils/cryptoUtils");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const sequelize = require("../config/database");
const generateToken = require("../utils/tokenUtil");
const emailService = require("../utils/emailUtilService");
const { Op } = require('sequelize');

const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);
  await user.update({ password: hashedPassword });

  return { message: "Password successfully changed" };
};

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password'],
    },
  });

  return users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber ,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    provider: user.provider,
    providerId: user.providerId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new Error("User not found");
  }
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    provider: user.provider,
    providerId: user.providerId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getUserByEmail = async (email) => {
  const encryptedEmail = encryptData(email.toLowerCase());
  const user = await User.findOne({ where: { email: encryptedEmail } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const searchUserService = async (field, value) => {
  const allowedFields = ['email', 'phoneNumber', 'firstName', 'lastName'];

  if (!field || !value) {
    throw new Error('Field and value are required');
  }

  if (!allowedFields.includes(field)) {
    throw new Error(`Search by '${field}' is not allowed`);
  }

  try {
    if (field === 'email' || field === 'phoneNumber') {
      const encryptedValue = encryptData(value);
      const users = await User.findAll({
        where: {
          [field]: encryptedValue
        },
        attributes: { exclude: ['password'] }
      });

      return users.map(user => ({
        id: user.id,
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        email: decryptData(user.email),
        phoneNumber: user.phoneNumber ? decryptData(user.phoneNumber) : null,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      }));
    } else {
      const users = await User.findAll({
        where: {
          [field]: {
            [Op.iLike]: `%${value}%`
          }
        },
        attributes: { exclude: ['password'] }
      });

      return users.map(user => ({
        id: user.id,
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        email: decryptData(user.email),
        phoneNumber: user.phoneNumber ? decryptData(user.phoneNumber) : null,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      }));
    }
  } catch (error) {
    console.error("Search error:", error);
    throw new Error('Error while searching users');
  }
};

const getUserByPhone = async (phone) => {
  const encryptedPhone = encryptData(phone);
  const user = await User.findOne({ where: { phoneNumber: encryptedPhone } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new Error("User not found");
  }

  const { email, phoneNumber, password, role, ...validUpdateData } = updateData;

  if (email || phoneNumber) {
    throw new Error("Email and phone number cannot be updated directly");
  }

  if (password) {
    throw new Error("Password update should be done via the 'change-password' API");
  }

  const updateObject = { ...validUpdateData };
  
  // Only update role if it's provided and valid
  if (role) {
    const validRoles = ["Customer", "Admin", "LoanOfficer", "Accountant"];
    if (validRoles.includes(role)) {
      updateObject.role = role;
    } else {
      throw new Error("Invalid role specified");
    }
  }

  await user.update(updateObject);
  return { 
    message: "User successfully updated",
    user: {
      id: user.id,
      firstName: user.firstNam,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    }
  };
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();
  return { message: "User successfully deleted" };
};

const activateAndDeactivateUser = async (userId, status) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ isActive: status });
  return { 
    message: `User ${status ? 'activated' : 'deactivated'} successfully`,
    user: {
      id: user.id,
      firstName: decryptData(user.firstName),
      lastName: decryptData(user.lastName),
      email: decryptData(user.email),
      phoneNumber: user.phoneNumber ? decryptData(user.phoneNumber) : null,
      role: user.role,
      isVerified: user.isVerified,
      isActive: status,
    }
  };
};

const getVerifiedUsers = async () => {
  const users = await User.findAll({ 
    where: { isVerified: true },
    attributes: { exclude: ['password'] },
  });
  
  return users.map(user => ({
    id: user.id,
    firstName: decryptData(user.firstName),
    lastName: decryptData(user.lastName),
    email: decryptData(user.email),
    phoneNumber: user.phoneNumber ? decryptData(user.phoneNumber) : null,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
  }));
};

const adminUserRegister = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phoneNumber, role = 'Customer' } = data;
    const normalizedEmail = email.trim().toLowerCase();
    
    const validRoles = ["Customer", "Admin", "LoanOfficer", "Accountant"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role specified");
    }

    const existingUser = await User.findOne({
      where: { email: encryptData(normalizedEmail) },
      transaction,
    });
    
    const existingPhoneNumber = await User.findOne({
      where: { phoneNumber: encryptData(phoneNumber) },
      transaction,
    });

    if (existingPhoneNumber) throw new Error("Phone number is already registered");
    if (existingUser) throw new Error("Email is already registered");

    const newUser = await User.create(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phoneNumber: phoneNumber ,
        role: role,
        isVerified: false,
        provider: 'byAdmin',
      },
      { transaction }
    );

    const resetToken = generateToken({ id: newUser.id }, "1h");
        // const token = generateToken({ id: user.id }, "1h");

    await emailService.sendInvitationEmail(
      normalizedEmail,
      resetToken
    );

    await transaction.commit();

    return { 
      message: "User registered successfully. Please check your email to set your password.",
      user: {
        id: newUser.id,
        email: normalizedEmail,
        role: newUser.role
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Registration failed: ${error.message}`);
  }
};

const getUnverifiedUsers = async () => {
  const users = await User.findAll({ 
    where: { isVerified: false },
    attributes: { exclude: ['password'] },
  });
  
  return users.map(user => ({
    id: user.id,
    firstName: decryptData(user.firstName),
    lastName: decryptData(user.lastName),
    email: decryptData(user.email),
    phoneNumber: user.phoneNumber ? decryptData(user.phoneNumber) : null,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
  }));
};

module.exports = {
  searchUserService,
  adminUserRegister,
  changePasswordService,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUser,
  deleteUser,
  activateAndDeactivateUser,
  getVerifiedUsers,
  getUnverifiedUsers,
};