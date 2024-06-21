import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
// import {getAll} from './controllers/BookController'
import {getAll} from './src/controllers/BookController';
import { authenticate } from './src/middlewares/authentication';
import { search } from './src/controllers/BookController';
import { updateShelf } from './src/controllers/BookController';

const app = express();

app.use(express.json());
app.use(cors());// enable cors for all routes and domains

app.get('/', (req: Request, res: Response): void => {
  res.send('Welcome to the home page!');
});

// TODO: Add middleware to check for Authorization token
// If not found in the database, create a new user with token
// Get the first ten books
// Assign each group of books with a shelf (currentlyReading, wantToRead, read)
app.get('/books',authenticate,  getAll);

app.post('/search', search);

app.put('/books/:bookId',authenticate, updateShelf);

export default app;