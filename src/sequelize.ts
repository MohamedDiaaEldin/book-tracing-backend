// Import Sequelize
import { Sequelize} from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import Book from './models/Book';
import User from './models/User';
import UserBook from './models/UserBooks';

dotenv.config(  );

const dialect: Dialect = process.env.DIALECT as Dialect || 'postgres';

let options = {}
if (process.env.NODE_ENV === 'production'){
      options = {
        ...options,
        dialectOptions: {
          ssl: {
            require: false,
            rejectUnauthorized: true
          }
        }
      }  
}


// Initialize Sequelize with database connection options using URL
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  ...options,
  dialect: dialect,
  models: [Book, User, UserBook],
  logging: false,
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: true
    }
  },
});

// Export Sequelize instance for use in other parts of the application
export default sequelize;
