const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./roleModel");
const Permission = require("./permissionModel");

const RolePermission = sequelize.define("RolePermission", {
  role_id: { type: DataTypes.INTEGER, references: { model: Role, key: "id" } },
  permission_id: { type: DataTypes.INTEGER, references: { model: Permission, key: "id" } },
});

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id", as: "permissions" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id", as: "roles" });

module.exports = RolePermission;
