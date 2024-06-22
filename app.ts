import express, { Request, Response } from 'express';
import cors from 'cors';
// import { Custome  } from 'cors';
import searchValidator from './src/middlewares/searchValidator';
import {getAll} from './src/controllers/BookController';
import { authenticate } from './src/middlewares/authentication';
import { search } from './src/controllers/BookController';
import { updateShelf } from './src/controllers/BookController';
import { loggingRequest } from './src/middlewares/logging';

const app = express();



// use middleware to parse the body of the request
app.use(express.json());


// enable CORS for all domains
app.use(cors());

app.use(loggingRequest)
// define the home route - health check
app.get('/', (req: Request, res: Response): void => {
  res.send('Welcome to the home page!');
});

/**
 * Get all books from the database
 * @route GET /books
 * @description Get all books from the database if user is signed in else return 10 default books books (defined in authenticate middleware)
 * @returns - the list of books
 */
app.get('/books',authenticate,  getAll);

/**
 * Search for books
 * @route POST /search
 * @description Search for books
 * @param word - the word to search for
 * @param maxResults - the maximum number of results to return
 * @returns - the list of books
 */
app.post('/search', searchValidator, search);

/**
 * Update the shelf of a book
 * @route PUT /books/:bookId
 * @description Update the shelf of a book
 * @param bookId - the id of the book
 * @param shelf - the shelf to update the book to
 * @returns success message
 */
app.put('/books/:bookId',authenticate, updateShelf);

export default app;