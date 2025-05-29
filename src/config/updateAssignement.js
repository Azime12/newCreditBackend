const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize instance
const sequelize = new Sequelize(
  "postgres://daily_task_management_system_xwmu_user:0mAnV0Mzwrta1NLEFxN8gORFlUFg9Wrj@dpg-ctfb40rtq21c73bsva30-a:5432/daily_task_management_system_xwmu",
  {
    dialect: "postgres",
    logging: false, // Optional: Disable query logging
  }
);

// Define User Model with correct table casing
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "assigned"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Users", // Use the exact casing of your table name ("Users" instead of "users")
  }
);

// Update User Status
async function updateUserStatus() {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log("Database connection successful!");

    // Ensure the 'Users' table exists and is synchronized
    await sequelize.sync(); // This will create the table if it doesn't exist

    // Update the user's status
    const [rowsUpdated] = await User.update(
      { status: "assigned" }, // New values
      { where: { user_id: 1 } } // Condition
    );

    if (rowsUpdated === 0) {
      console.log("No user found with the specified ID.");
    } else {
      console.log("User with ID 1 updated successfully to 'assigned'.");
    }
  } catch (error) {
    console.error("Error updating user status:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the update function
updateUserStatus();
