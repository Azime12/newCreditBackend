const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// Valid roles for authorization
const VALID_ROLES = ["Customer", "Admin", "LoanOfficer", "Accountant"];

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  // Check for presence of Authorization header
  if (!authHeader) {
    return res.status(401).json({ 
      code: "MISSING_TOKEN",
      message: "Authorization token required" 
    });
  }

  // Extract token from Bearer scheme
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      code: "INVALID_TOKEN_FORMAT",
      message: "Token must follow 'Bearer <token>' format" 
    });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      ignoreExpiration: false
    });

    // Fetch user and verify account status
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role", "isActive", "isVerified"]
    });

    if (!user) {
      return res.status(401).json({ 
        code: "USER_NOT_FOUND",
        message: "User account not found" 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        code: "ACCOUNT_INACTIVE",
        message: "User account is inactive" 
      });
    }

    // Attach minimal user data to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.name);

    const response = {
      code: "AUTH_ERROR",
      message: "Authentication failed"
    };

    switch (error.name) {
      case "TokenExpiredError":
        response.code = "TOKEN_EXPIRED";
        response.message = "Session expired, please login again";
        break;
      case "JsonWebTokenError":
        response.code = "INVALID_TOKEN";
        response.message = "Invalid authentication token";
        break;
    }

    return res.status(401).json(response);
  }
};

/**
 * Role Authorization Middleware
 * Restricts access based on user roles
 */
const authorizeRoles = (...allowedRoles) => {
  // Validate allowed roles during initialization
  const invalidRoles = allowedRoles.filter(role => !VALID_ROLES.includes(role));
  if (invalidRoles.length > 0) {
    throw new Error(`Invalid roles specified: ${invalidRoles.join(", ")}`);
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        code: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: `Requires one of these roles: ${allowedRoles.join(", ")}`,
        currentRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Ownership Check Middleware
 * Verifies user owns the resource they're trying to access
 */
const authorizeOwnership = (modelName, idParam = "id") => {
  return async (req, res, next) => {
    try {
      const model = require(`../models/${modelName}Model`);
      const resource = await model.findByPk(req.params[idParam]);

      if (!resource) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: `${modelName} not found`
        });
      }

      // Allow admins to bypass ownership check
      if (req.user.role === "Admin") {
        req.resource = resource;
        return next();
      }

      // Verify ownership (assuming resources have userId field)
      if (resource.userId !== req.user.id) {
        return res.status(403).json({
          code: "OWNERSHIP_REQUIRED",
          message: "You don't have permission to access this resource"
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        code: "SERVER_ERROR",
        message: "Error verifying resource ownership"
      });
    }
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
  authorizeOwnership
};