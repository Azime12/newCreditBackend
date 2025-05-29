const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const generateToken = require("../utils/tokenUtil");
const { encryptData } = require("../utils/cryptoUtils");
const { Op } = require("sequelize");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");
const UserRole = require("../models/userRoleModel");
const RolePermission = require("../models/rolePermissionModel");
const sequelize = require("../config/database");
const otpStore = new Map(); // In-memory storage (Use Redis for production)
const generateOtp=require("../utils/otpUtil");
const Permission = require("../models/permissionModel");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// const emailService = require('../utils/emailService');
const emailService=require("../utils/emailUtilService")
// exports.sendVerification = async (req, res) => {
//   try {
//     const { email, token } = req.body;
//     if (!email || !token) {
//       return res.status(400).json({ error: 'Email and token are required' });
//     }

//     await emailService.sendVerificationEmail(email, token);
//     res.json({ success: true, message: 'Verification email sent' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.sendPasswordReset = async (req, res) => {
//   try {
//     const { email, token } = req.body;
//     if (!email || !token) {
//       return res.status(400).json({ error: 'Email and token are required' });
//     }

//     await emailService.sendPasswordResetEmail(email, token);
//     res.json({ success: true, message: 'Password reset email sent' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const userRegister = async (data) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { firstName, lastName, email, phoneNumber, password } = data;

    // Normalize email and encrypt it for DB search
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email or phone number already exists
    const existingUser = await User.findOne({
      where: { email: encryptData(normalizedEmail) },
      transaction,
    });
    const existingPhoneNumber = await User.findOne({
      where: { phoneNumber: encryptData(phoneNumber) },
      transaction,
    });

    if (existingPhoneNumber)
      throw new Error("Phone number is already registered");
    if (existingUser) throw new Error("Email is already registered");

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user within the transaction
    const newUser = await User.create(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail, // Save encrypted email
        phoneNumber: phoneNumber, // Save encrypted phone
        password: hashedPassword,
        isVerified: false,
      },
      { transaction }
    );

    const [customerRole, created] = await Role.findOrCreate({
      where: { name: "Customer" },
      transaction,
    });

     await UserRole.create(
      {
        UserId: newUser.id,
        RoleId: customerRole.id,
      },
      { transaction }
    );

    // Send verification email
    const token = generateToken({
      userId: newUser.id, // Keep payload structure consistent
      email: newUser.email,
    }, "1h"); // You can use "30d" for long expiration
    
    // const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?verify=${token}`;
    // await sendEmail(newUser?.email,"Email Verification",
    //        `<p>Click the link below to verify your email:</p>
    //        <a href="${verificationUrl}">Verify Email</a>`
    // );
   
    
        await emailService.sendVerificationEmail(newUser?.email, token);
     
    // Commit the transaction if everything is successful
    await transaction.commit();

    return { message: "Verification email sent. Please check your email." };
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    throw new Error(`Registration failed: ${error.message}`);
  }
};






// services/socialLoginService.js
// const { User, Role, UserRole } = require('../models'); // Assuming models are exported like this
// const { encryptData, generateToken } = require('../utils'); // Replace with your utility functions
// const { client } = require('../google-client'); // Assuming Google client setup is imported here
// const sequelize = require('sequelize'); // Assuming you use Sequelize for database transactions

// src/services/authService.js

const socialLogin = async (idToken, provider) => {
  const transaction = await sequelize.transaction();
  try {
    if (provider !== "google") {
      throw new Error("Unsupported provider");
    }

    // 🔐 Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: providerId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: profileImage,
    } = payload;

    if (!email) {
      throw new Error("Google account must have an email");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const encryptedEmail = encryptData(normalizedEmail);

    // 🔍 Check if user exists
    let user = await User.findOne({ where: { email: encryptedEmail }, transaction });
    if (!user) {
      user = await User.findOne({ where: { providerId }, transaction });
    }

    let isNewUser = false;

    // 👶 Create new user if not found
    if (!user) {
      user = await User.create(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          phoneNumber: null,
          password: null,
          profileImage: profileImage || null,
          isVerified: true,
          provider,
          providerId,
          isActive: true,
        },
        { transaction }
      );
      isNewUser = true;
    }

    // 🧾 Assign default "Customer" role
    if (isNewUser) {
      const customerRole = await Role.findOne({ where: { name: "Customer" }, transaction });
      if (!customerRole) throw new Error("Default role not found");

      await UserRole.findOrCreate({
        where: { UserId: user.id, RoleId: customerRole.id },
        transaction,
      });
    }

    // ✅ COMMIT transaction before anything else
    await transaction.commit();

    // 🔁 Reload with roles and permissions
    user = await User.findOne({
      where: { id: user.id },
      include: [
        {
          model: Role,
          as: "Roles",
          include: [{ model: Permission, as: "permissions", attributes: ["name"] }],
          through: { attributes: [] },
        },
      ],
    });

    // ❌ Validate account status
    if (!user.isVerified) {
      throw new Error("Your email is not verified. Please check your email.");
    }

    if (!user.isActive) {
      throw new Error("Your account is not active. Please contact customer support.");
    }

    // 🔓 Extract roles and permissions
    const rolesWithPermissions = (user.Roles || []).map((role) => ({
      role: role.name,
      permissions: role.permissions?.map((perm) => perm.name) || [],
    }));

    // 🔑 Generate access token
    const token = generateToken(
      {
        id: user.id,
        email: normalizedEmail,
        provider: user.provider,
        providerId: user.providerId,
        rolesWithPermissions,
      },
      "30d"
    );

    return {
      message: "Social login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: normalizedEmail,
        provider: user.provider,
        providerId: user.providerId,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        roles: rolesWithPermissions,
      },
    };
  } catch (error) {
    // 🚨 Safely rollback if not finished
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error("🔥 Failed to rollback transaction:", rollbackErr);
      }
    }

    console.error("❌ Error during social login:", error);
    throw new Error(`Social login failed: ${error.message}`);
  }
};




const assignRoleToUserService = async (userId, roleName) => {
  // Check if the user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the role is valid
  const validRoles = ["Customer", "Admin", "LoanOfficer", "Accountant"];
  if (!validRoles.includes(roleName)) {
    throw new Error("Invalid role");
  }

  // Check if the user already has this role
  if (user.role === roleName) {
    throw new Error("User already has this role assigned");
  }

  // Update the user's role
  user.role = roleName;
  await user.save();

  return { 
    message: "Role assigned successfully",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};


// Assign Permission to Role
const assignPermissionToRoleService = async (roleId, permissionId) => {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const permission = await Permission.findByPk(permissionId);
  if (!permission) {
    throw new Error("Permission not found");
  }

  // Check if the permission is already assigned to the role
  const existingAssignment = await RolePermission.findOne({
    where: { role_id: roleId, permission_id: permissionId },
  });

  if (existingAssignment) {
    throw new Error("Permission already assigned to role");
  }

  // Assign permission to role
  await RolePermission.create({ role_id: roleId, permission_id: permissionId });
  return { message: "Permission assigned to role successfully" };
};



const userLogin = async (data) => {
  try {
    const { email, phoneNumber, password } = data;
    console.log("Login attempt with:", email || phoneNumber);
    
    // Validate input
    if (!email && !phoneNumber) {
      throw new Error("Please provide an email or phone number.");
    }

    const encryptedEmail = email ? encryptData(email.toLowerCase()) : null;
    const encryptedPhone = phoneNumber ? encryptData(phoneNumber) : null;

    // Simplified query - no more Role/Permission includes
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: encryptedEmail },
          { phoneNumber: encryptedPhone }
        ]
      }
    });

    if (!user) {
      throw new Error("User not found. Please register and try again!");
    }

    console.log("User found:", user.id);

    // Check if email is verified
    if (!user.isVerified) {
      throw new Error("Your email is not verified. Please check your email.");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Your account is not active. Please contact customer service.");
    }

    // Check password match
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password or email.");
    }

    // Generate JWT token - now just includes the single role
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role // Single role from User model
    }, "10d");

    console.log("Login token generated");

    // Return login response
    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role // Single role
      },
    };
  } catch (error) {
    console.error("Login error:", error.message);
    throw new Error(error.message || "An error occurred during login.");
  }
};




 

const requestPasswordReset = async (data) => {
  try {

    // Ensure `data` is an object and extract `email`
    if (!data || typeof data !== "object" || !data.email) {
      throw new Error("Invalid email input");
    }

    // Normalize and validate email
    const normalizedEmail = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Invalid email format");
    }

    // Encrypt the email
    const encryptedEmail = encryptData(normalizedEmail);
    console.log("email",encryptedEmail)
   
    const user = await User.findOne({ where: { email: encryptedEmail } });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("You cannot reset this password.  may be you have logged in with a provider like Google.");
    }
    // Generate reset token
    const token = generateToken({ id: user.id }, "1h");
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // // Send email
    // await sendEmail(user.email, "Password Reset Request", `
    //   <p>Click the link below to reset your password:</p>
    //   <a href="${resetLink}">Reset Password</a>
    // `);

    console.log("suer .email",user?.email)
    await emailService.sendPasswordResetEmail(user.email, token);

    return { message: "Password reset email sent , check your email" };
  } catch (error) {
    console.error("❌ Error in requestPasswordReset:", error.message);
    throw new Error(error.message || "Password reset request failed");
  }
};




 const verifyEmailService = async (token) => {
  console.log("email try to verify....")
  if (!token) {
    throw new Error("Verification token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const userId = decoded?.userId;
    
    if (!userId) {
      throw new Error("Invalid token format");
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User does not exit ");
    }

    if (user.isVerified) {
      return { message: "Email already verified  Please login", status: 200 };
    }

    user.isVerified = true;
    user.isActive=true;
    await user.save();

    return { message: "Email successfully verified!", status: 200 };
  } catch (error) {
    throw new Error(error.message || "Invalid or expired token");
  }
};




 const resendVerificationEmailService = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    return { success: true, message: "Email already verified" };
  }

  // Generate new verification token
  const token = generateToken({ userId: user.id, email: user.email }, "1h");

  // Construct verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  // Send verification email
  await sendEmail(
    user.email,
    "Email Verification",
    `<p>Click the link below to verify your email:</p>
     <a href="${verificationUrl}">Verify Email</a>`
  );

  return { success: true, message: "Verification email resent successfully" };
};



const resetPassword = async (token, newPassword) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token form ba",decoded)
    console.log("Decoded token:", decoded);

    // Find the user by ID decoded from the token
    const user = await User.findByPk(decoded.id); // Make sure you use 'userId' if that's how you generated the token
    if (!user) throw new Error("User not found");

    // If no password set and the provider is 'byAdmin', allow the password to be set
    if (!user.password) {
      if (user.provider !== 'byAdmin') {
        throw new Error("Password reset not allowed for this login method.");
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // If the user was invited by the admin, mark as verified and active after setting password
    if (user.provider === 'byAdmin') {
      user.isVerified = true;  // Mark the email as verified
      user.isActive = true;    // Set the user as active
    }

    // Set the new password
    user.password = hashedPassword;

    // Save the new password, and update the isVerified and isActive fields if applicable
    await user.save();

    return { message: "Password set successfully. Your account is now verified and active." };
  } catch (error) {
    console.error("Error resetting password:", error.message);
    throw new Error("Invalid or expired token");
  }
};




// Request OTP
const requestOTPAuth = async (email) => {
  try {
    const normalizedEmail = encryptData(email);
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) throw new Error("User not found");

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    otpStore.set(email, { otp, expiresAt });

    await sendEmail(email, "Your OTP Code", `Your OTP is: <b>${otp}</b>`);

    return { message: "OTP sent successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Verify OTP & Authenticate
const verifyOTPAuth = async (email, otp) => {
  try {
    const storedOTP = otpStore.get(email);
    if (!storedOTP) throw new Error("OTP expired or invalid");

    if (storedOTP.otp !== otp) throw new Error("Invalid OTP");
    if (Date.now() > storedOTP.expiresAt) throw new Error("OTP expired");

    const user = await User.findOne({ where: { email: encryptData(email) } });
    if (!user) throw new Error("User not found");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    otpStore.delete(email);

    return { message: "Authentication successful", token };
  } catch (error) {
    throw new Error(error.message);
  }
};

// In services/userService.js

module.exports = {
  userRegister,
  verifyEmailService,
  userLogin,
  requestPasswordReset,
  resetPassword,
  requestOTPAuth,
  verifyOTPAuth,
  assignPermissionToRoleService,
  assignRoleToUserService,
  resendVerificationEmailService,
  socialLogin
};
