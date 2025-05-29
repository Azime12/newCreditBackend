const UserLog = require("../models/logModel");
const { Op } = require("sequelize");

// Get all logs (with optional pagination)
const getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page 1, limit 10
    const offset = (page - 1) * limit;

    const logs = await UserLog.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      totalLogs: logs.count,
      totalPages: Math.ceil(logs.count / limit),
      currentPage: parseInt(page),
      logs: logs.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve logs", error: error.message });
  }
};

// Get logs by user ID
const getLogsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await UserLog.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!logs.length) {
      return res.status(404).json({ message: "No logs found for this user" });
    }

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user logs", error: error.message });
  }
};

// Get logs by category (e.g., AUTHENTICATION, TRANSACTION, SECURITY)
const getLogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const logs = await UserLog.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
    });

    if (!logs.length) {
      return res.status(404).json({ message: "No logs found for this category" });
    }

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs by category", error: error.message });
  }
};

// Get logs filtered by date range
const getLogsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const logs = await UserLog.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs by date", error: error.message });
  }
};

module.exports = { getAllLogs, getLogsByUserId, getLogsByCategory, getLogsByDate };
