import Book, { BookAttributes } from '../models/Book';
import User from '../models/User';
import sequelize  from '../sequelize';


// simplified book object
export interface UserBooks extends BookAttributes{
    shelf: any;
}

/**
 *
 * @param token
 * @description Retrieves a list of books associated with a user
 * @returns A Promise that resolves when the response is sent.
 */
export const getUserBooks = async (token: string): Promise<UserBooks[]> => {
  try{
    //sync database 
    await sequelize.sync();
    let books:UserBooks[] = [];
    const userWithBooks = await User.findOne( {
      where: { token: token},
    include: {model: Book, through: {attributes: ['shelf']}}
   });

  if (userWithBooks) {
    for (const book of userWithBooks.books) {

      books.push({
        id: book.id,
        title: book.title,
        authors: book.authors,
        smallThumbnail: book.smallThumbnail,
        shelf: (book as any).UserBook.shelf
      });
    }
  }

    return books;
  }
  catch(error){
    console.error('Error getting user books');
    console.log(error)
    throw error;
  }

};
