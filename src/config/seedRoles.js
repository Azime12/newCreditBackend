const Role = require("../models/roleModel");

const seedRoles = async () => {
    const roles = ["Customer", "Admin", "LoanOfficer", "Accountant"];

    for (let roleName of roles) {
        await Role.findOrCreate({ where: { name: roleName } });
    }

    console.log("Roles seeded successfully.");
};

seedRoles();
