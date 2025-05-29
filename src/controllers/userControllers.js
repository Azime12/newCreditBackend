const UserService = require("../services/userService");
const { 
  updateUserInfoSchema,
  adminUserRegisterSchema,
  changePasswordSchema,
  userIdSchema,
  emailSchema,
  phoneSchema,
  searchUserSchema,
  userStatusSchema
} = require('../validators/userValidation');

// Helper function to handle controller responses
const handleResponse = async (res, serviceMethod, ...args) => {
  try {
    const result = await serviceMethod(...args);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ 
      error: error.message || 'An error occurred' 
    });
  }
};

// Password Controller
const changePassword = async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { userId, currentPassword, newPassword } = req.body;
  await handleResponse(
    res, 
    UserService.changePasswordService, 
    userId, 
    currentPassword, 
    newPassword
  );
};

// User Retrieval Controllers
const getAllUsers = async (req, res) => {
  await handleResponse(res, UserService.getAllUsers);
};

const getUserById = async (req, res) => {
  const { error } = userIdSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { userId } = req.params;
  await handleResponse(res, UserService.getUserById, userId);
};

const getUserByEmail = async (req, res) => {
  const { error } = emailSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email } = req.params;
  await handleResponse(res, UserService.getUserByEmail, email);
};

const getUserByPhone = async (req, res) => {
  const { error } = phoneSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { phone } = req.params;
  await handleResponse(res, UserService.getUserByPhone, phone);
};

const searchUsersController = async (req, res) => {
  const { error } = searchUserSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { field, value } = req.query;
  await handleResponse(res, UserService.searchUserService, field, value);
};

// User Management Controllers
const adminUserRegister = async (req, res) => {
  const { error } = adminUserRegisterSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { firstName, lastName, email, phoneNumber, role } = req.body;
  await handleResponse(
    res,
    UserService.adminUserRegister,
    { firstName, lastName, email, phoneNumber, role }
  );
};

const updateUser = async (req, res) => {
  const paramsError = userIdSchema.validate(req.params).error;
  const bodyError = updateUserInfoSchema.validate(req.body).error;
  
  if (paramsError || bodyError) {
    const error = paramsError || bodyError;
    return res.status(400).json({ error: error.details[0].message });
  }

  const { userId } = req.params;
  await handleResponse(res, UserService.updateUser, userId, req.body);
};

const deleteUser = async (req, res) => {
  const { error } = userIdSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { userId } = req.params;
  await handleResponse(res, UserService.deleteUser, userId);
};

const activateAndDeactivateUser = async (req, res) => {
  const paramsError = userIdSchema.validate(req.params).error;
  const bodyError = userStatusSchema.validate(req.body).error;
  
  if (paramsError || bodyError) {
    const error = paramsError || bodyError;
    return res.status(400).json({ error: error.details[0].message });
  }

  const { userId } = req.params;
  const { status } = req.body;
  await handleResponse(res, UserService.activateAndDeactivateUser, userId, status);
};

// Status Filter Controllers
const getVerifiedUsers = async (req, res) => {
  await handleResponse(res, UserService.getVerifiedUsers);
};

const getUnverifiedUsers = async (req, res) => {
  await handleResponse(res, UserService.getUnverifiedUsers);
};

module.exports = {
  adminUserRegister,
  changePassword,
  searchUsersController,
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