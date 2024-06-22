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
  try {
    const token:string = req.headers.token as string;
    if (!token){
      return res.status(401).json({ message: 'Unauthorized' });

    }
    // Ensure the database is in sync
    await sequelize.sync();

    // get books associated with a user
    let books:UserBooks[] = [];

    if (token){
      books  = await getUserBooks(token);
    }

    const response = { books:books,length:10};

    return res.json(response);
  } catch (error) {
    console.error('Error retrieving books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  finally{
    // close database connection
    await sequelize.close();
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
  finally{
    // close database connection
    await sequelize.close();
  }
};

/**
 * @description Update the shelf of a book
 * @para
 * @returns A Promise that resolves when the response is sent.
 */
export const updateShelf = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>>=> {
  try {
    const token:string = req.headers.token as string;
    const bookId:string = req.params.bookId;
    const shelf:string = req.body.shelf;

    // Query the association table to see if the user has the book
    const userBook = await UserBook.findOne({
      where: {
        userToken: token,
        bookId: bookId
      }
    });

    // if book association exists, update the shelf
    if (userBook) {
      userBook.shelf = shelf;
      await userBook.save();
      return res.json({ message: 'Shelf updated successfully' });
    }
    // else  -  if book association does not exist, create a new association

    // check if the book exists
    const book = await Book.findByPk(bookId);
    // if book does not exist, return 404
    if (!book) {
      const s  = res.status(404).json({message:'Book Not Found'});
      return s;
    }

    // create a new association
    const newUserBook  = await UserBook.create({
      userToken: token,
      bookId: bookId,
      shelf: shelf
    });
      // save the association
    await newUserBook.save();
    return res.json({ message: 'Shelf updated successfully' });

  }
  catch (error) {
    console.error('Error updating shelf:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  finally{
    // close database connection
    await sequelize.close();
  }
};
