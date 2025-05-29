const cron = require("node-cron");
const { Op } = require("sequelize");
const User = require("../models/userModel"); // Ensure correct import

const deleteUnverifiedUsers = () => {
  cron.schedule("0 0 * * * *", async () => { // Runs every hour
    try {
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() - 1); // Users older than 1 hour

      const deletedUsers = await User.destroy({
        where: {
          isVerified: false,
          createdAt: { [Op.lt]: expirationTime }, // Users created more than 1 hour ago
        },
      });

      console.log(`${deletedUsers} unverified users deleted.`);
    } catch (error) {
      console.error("Error deleting unverified users:", error.message);
    }
  });
};

module.exports = { deleteUnverifiedUsers };
