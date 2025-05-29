// userRoleModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const Role = require("./roleModel");

const UserRole = sequelize.define("UserRole", {
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  RoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Role, key: "id" },
  },
}, { timestamps: true });


// Define the many-to-many relationship between User and Role
User.belongsToMany(Role, { through: UserRole, foreignKey: 'UserId', otherKey: 'RoleId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'RoleId', otherKey: 'UserId' });

module.exports = UserRole;
