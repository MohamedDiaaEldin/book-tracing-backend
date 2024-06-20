import { Response, Request } from 'express';
import Book, { BookAttributes } from '../models/Book';
import sequelize from '../sequelize';
import User from '../models/User';

interface SimplifiedBook extends BookAttributes{  
  shelf: any;
}
/**
 * @description Retrieves a list of books associated with a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolveThe request object.s when the response is sent.
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.token;
    // Ensure the database is in sync
    await sequelize.sync();

    // Read all books from the table
    // join books table with userbooks table on bookId and get all attributes from book table
    let books:SimplifiedBook[] = []
    const userWithBooks = await User.findOne( { 
      where: { token: token}, 
      include: {model: Book, through: {attributes: ['shelf']}}
    })
    
    if (userWithBooks) { 
      for (const book of userWithBooks.books) {        
      
        books.push({
          id: book.id,
          title: book.title,
          authors: book.authors,
          smallThumbnail: book.smallThumbnail,
          shelf: (book as any).UserBook.shelf
        })
      }
    }
    
    const response = { books:books,length:10};

    res.json(response);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
