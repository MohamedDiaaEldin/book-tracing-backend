import { Response, Request } from 'express';
import Book from '../models/Book';
import { Op } from 'sequelize';
import sequelize from '../sequelize';
import { getUserBooks, UserBooks } from '../services/UserBooks';
import UserBook from '../models/UserBooks';

/**
 * @description Retrieves a list of books associated with a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolveThe request object.s when the response is sent.
 */
export const getAll = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  console.log('Getting all books')
  try {
    const token:string = req.headers.token as string;
    if (!token){
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Ensure the database is in sync
    // await sequelize.sync();
    // console.log('After sync')

    // get books associated with a user
    let books:UserBooks[] = [];

    if (token){
      books  = await getUserBooks(token);
    }

    console.log('After getUserBooks')

    const response = { books:books,length:10};

    return res.json(response);
  } catch (error) {
    console.error('Error retrieving books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/*
* @description Search for books
* @param query - The query to search for.
* @param maxResults - The maximum number of results to return.
* @returns A Promise that resolves when the response is sent.
*/
export const search = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {

    // query and maxResults are passed in the body of the request
    const {query, maxResults}:{query:string, maxResults:number} = req.body;

    // search for a books using it's title or author
    let books:Book[] = [];
    books = await Book.findAll({
      where: {
        title: { [Op.like]: `%${query}%` }
      },
      limit: maxResults
    });
    return res.json({books:books, length:books.length});
  }
  catch (error) {
    console.error('Error retrieving books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
 
};

/**
 * @description Update the shelf of a book
 * @para
 * @returns A Promise that resolves when the response is sent.
 */
export const updateShelf = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>>=> {
  console.log('Updating Book shelf')
  try {
    const token:string = req.headers.token as string;
    const bookId:string = req.params.bookId;
    const shelf:string = req.body.shelf;

    // create transaction
    const transaction = await sequelize.transaction();
    
    // Query the association table to see if the user has the book
    const userBook = await UserBook.findOne({
      where: {
        userToken: token,
        bookId: bookId
      }
    });
    
    
    // check if the book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({message:'Book Not Found'});
    }

    // if book association exists, update the shelf
    if (userBook) {
      console.log('Book associated with a user ', bookId)
      userBook.shelf = shelf;
      await userBook.save({transaction:transaction});      
    }
    else{
      // else - if book association does not exist, create a new association
      console.log('Book not associated with a user ')
      // create new association
      await UserBook.create({
        userToken: token,
        bookId: bookId,
        shelf: shelf
      }, {transaction:transaction});
    }
    
    // commit 
    await transaction.commit();
    
    console.log('Book Updated .....')
    return res.json({ message: 'Shelf updated successfully' });
  }
  catch (error) {
    console.error('Error updating shelf:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
