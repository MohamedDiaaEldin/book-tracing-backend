// Import Sequelize
import { Sequelize} from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import Book from './models/Book';
import User from './models/User';
import UserBook from './models/UserBooks';

dotenv.config(  );

const dialect: Dialect = process.env.DIALECT as Dialect || 'postgres';


// self signed certificate
let options = {
  pool: {
    max: 1000,
    min: 0,
    acquire: 30000, // 30 seconds
    idle: 10000, // 10 seconds
  },
};


const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);
// Initialize Sequelize with database connection options using URL
const sequelize = new Sequelize(DATABASE_URL!, {
  ...options,
  dialect: dialect,
  models: [Book, User, UserBook],
  logging: false,
});

// Export Sequelize instance for use in other parts of the application
export default sequelize;
