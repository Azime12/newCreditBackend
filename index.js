require('dotenv').config({ path: './src/config/.env' });
const app = require('./app');
const sequelize = require('./config/database');

// Initialize database connection
sequelize.sync({ force: false })
  .then(() => console.log('Database connected (Vercel)'))
  .catch(err => console.error('Database connection error:', err));

module.exports = app;