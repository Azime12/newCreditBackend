// seed.js
const seedAll = require('./seedRolesAndPermissions');
const sequelize = require('./database');

async function runSeed() {
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop tables and recreate
    await seedAll();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

runSeed();