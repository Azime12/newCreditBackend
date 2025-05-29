// seedRolesAndPermissions.js
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');
const RolePermission = require('../models/rolePermissionModel');
const permissions = require('./permissions');

async function seedRoles() {
  const defaultRoles = [
    { name: 'Customer', description: 'Regular customer with basic access' },
    { name: 'Admin', description: 'System administrator with full access' },
    { name: 'LoanOfficer', description: 'Loan officer with loan management access' },
    { name: 'Accountant', description: 'Accountant with financial access' }
  ];

  await Role.bulkCreate(defaultRoles, { ignoreDuplicates: true });
}

async function seedPermissions() {
  const allPermissions = [];
  
  // Flatten the permissions object
  for (const category in permissions) {
    for (const action in permissions[category]) {
      allPermissions.push({
        name: permissions[category][action],
        description: `${action} permission for ${category.toLowerCase()}`
      });
    }
  }

  await Permission.bulkCreate(allPermissions, { ignoreDuplicates: true });
}

async function assignAdminPermissions() {
  const adminRole = await Role.findOne({ where: { name: 'Admin' } });
  const allPermissions = await Permission.findAll();
  
  const adminPermissions = allPermissions.map(permission => ({
    role_id: adminRole.id,
    permission_id: permission.id
  }));

  await RolePermission.bulkCreate(adminPermissions, { ignoreDuplicates: true });
}

async function assignRolePermissions() {
  const roles = await Role.findAll();
  const allPermissions = await Permission.findAll();
  
  // Assign permissions based on role
  for (const role of roles) {
    let permissionsToAssign = [];
    
    switch(role.name) {
      case 'LoanOfficer':
        permissionsToAssign = allPermissions.filter(p => 
          p.name.includes('loan') || 
          p.name.includes('account_number') ||
          p.name.includes('user.view')
        );
        break;
        
      case 'Accountant':
        permissionsToAssign = allPermissions.filter(p => 
          p.name.includes('saving') || 
          p.name.includes('transaction') ||
          p.name.includes('loan_payment') ||
          p.name.includes('user.view')
        );
        break;
        
      case 'Customer':
        permissionsToAssign = allPermissions.filter(p => 
          p.name.includes('user_profile') ||
          p.name.includes('auth.') ||
          p.name === 'account_number.view' ||
          p.name === 'saving_account.view' ||
          p.name === 'loan.view'
        );
        break;
    }
    
    const rolePermissions = permissionsToAssign.map(permission => ({
      role_id: role.id,
      permission_id: permission.id
    }));
    
    await RolePermission.bulkCreate(rolePermissions, { ignoreDuplicates: true });
  }
}

async function seedAll() {
  try {
    await seedRoles();
    await seedPermissions();
    await assignAdminPermissions();
    await assignRolePermissions();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedAll;