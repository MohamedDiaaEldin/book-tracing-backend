import { Response, Request } from 'express';
import Book from '../models/Book';
import { Op, Sequelize, Transaction } from 'sequelize';
import sequelize from '../sequelize';
import { getUserBooks, UserBooks } from '../services/UserBooks';
import UserBook from '../models/UserBooks';

/**
 * @description Retrieves a list of books associated with a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolveThe request object.s when the response is sent.
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const token:string = req.headers.token as string;
    if (!token){
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    // Ensure the database is in sync
    await sequelize.sync();

    // get books associated with a user
    let books:UserBooks[] = [];

    if (token){
      books  = await getUserBooks(token);
    }

    const response = { books:books,length:10};

    res.json(response);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// search for a books using it's title or author
//takes query and maxResults as json
export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const token:string = req.headers.token as string;
    const query:string = req.body.query;
    const maxResults:number = req.body.maxResults;

    console.log(query, '  ', maxResults);
    // search for a books using it's title or author
    const books = await Book.findAll({
      where: {
        title: { [Op.like]: `%${query}%` }
      },
      limit: maxResults
    });

    res.json({books:books, length:books.length});
  }
  catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update shelf
// update shelf
export const updateShelf = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>>=> {
  try {

    console.log('Update Shelf');
    const token:string = req.headers.token as string;
    const bookId:string = req.params.bookId;
    const shelf:string = req.body.shelf;

    console.log(token);
    console.log(bookId);
    console.log(shelf);
    // update the shelf of the book
    const userBook = await UserBook.findOne({
      where: {
        userToken: token,
        bookId: bookId
      }
    });

    if (userBook) {
      userBook.shelf = shelf;
      await userBook.save();

    } else {
      const transaction = await sequelize.transaction(); // Start a transaction
      try{
        const book = await Book.findByPk(bookId);
        if (!book) {
          const s  = res.status(404).json({message:'Book Not Found'});
          return s;
        }

        const userBook  = await UserBook.create({
          userToken: token,
          bookId: bookId,
          shelf: shelf
        });
        await userBook.save();
      }
      catch(error){
        console.log('error adding book with user ');
        return res.status(500).json({message:'Server Error'});
      }

    }

    return res.json({ message: 'Shelf updated successfully' });
  }
  catch (error) {
    console.error('Error updating shelf:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
