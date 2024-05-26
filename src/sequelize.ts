
// Import Sequelize
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Initialize Sequelize with database connection options
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres', // Change this to your database dialect (e.g., postgres, sqlite)
});

// Define models and associations here...

// Export Sequelize instance for use in other parts of the application
export default sequelize;
