const { DataTypes } = require("sequelize");

// Initialize the database connection
const { Sequelize } = require("sequelize");

// Directly include your database credentials
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false, // Optional: Disable query logging
});

module.exports = sequelize;


const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categories: {
      type: DataTypes.ENUM(
        "Sub-City Head",
        "Sector Leader",
        "Coordinator",
        "Group Leader",
        "Professional",
        "Admin"
      ),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

// Define associations
User.hasMany(Role, { foreignKey: "user_id" });
Role.belongsTo(User, { foreignKey: "user_id" });

// Function to insert a new role
async function insertRole() {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log("Database connection successful!");

    // Sync models (optional: use force: true to drop and recreate tables)
    await sequelize.sync();

    // Insert a new role
    const newRole = await Role.create({
      categories: "Admin",
      user_id: 1, // Replace with the actual user ID
    });

    console.log("New role created:", newRole.toJSON());
  } catch (error) {
    console.error("Error inserting role:", error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

// Run the function
insertRole();
