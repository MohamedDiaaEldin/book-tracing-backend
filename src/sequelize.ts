// Import Sequelize
import { Sequelize} from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import Book from './models/Book';
dotenv.config(  );

const dialect: Dialect = process.env.DIALECT as Dialect || 'postgres';

// Initialize Sequelize with database connection options
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: dialect,
  models:[Book]

});

// Define models and associations here...

// Export Sequelize instance for use in other parts of the application
export default sequelize;
