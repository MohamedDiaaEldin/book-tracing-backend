import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
// import {getAll} from './controllers/BookController'
import {getAll} from './controllers/BookController';


const app = express();

app.use(express.json());




app.get('/', (req: Request, res: Response): void => {
  res.send('Welcome to the home page!');
});




// TODO: Add middleware to check for Authorization token
// If not found in the database, create a new user with token
// Get the first ten books
// Assign each group of books with a shelf (currentlyReading, wantToRead, read)
app.get('/books', getAll);






export default app