import { NextFunction, Request, Response } from 'express';
import Book  from '../models/Book';
import  User  from '../models/User';
import UserBook from '../models/UserBooks';
import sequelize from '../sequelize';
import { Transaction } from 'sequelize';

import { sign, verify } from '../utils/jwt';

/** Receives userId and transaction
 * @param req - User Id - User client id.
 * @param res
 * @param next
 * @returns A List of Books each assigned with shelf
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // .Check for Authorization header
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    // .Extract token from Request Headers
    const token = authHeader.split(' ')[1];
    if (!token){
      return res.status(400).json({message: 'Bad Request'});
    }

    

    const transaction = await sequelize.transaction();// start a transaction
    let books  = []
    // Verify Token
    if ( ! verify(token) ){
      // To Check if the user deleted the JWT and Send the random generated token
      let user = await User.findByPk(token) ;

      if ( ! user ){
        // Create New User With Random Token
        user  = await User.create({
          token: token
        }, {transaction});
        await setDefaultBooks(token,transaction);
        await transaction.commit();
        
      }
    

    }


    const JWT = sign({ randomToken: token });
    res.set('Authorization', `Bearer ${JWT}`);
    req.headers.token = token;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

/** Receives userId and transaction
 *  - Get first 10 books
 *  - Assign books with userID
 *  - Define book shelves
 *  - add changes into the transaction
 * @param userId - User Id - User client id.
 * @param transaction
 * @returns A List of Books each assigned with shelf
 */
const setDefaultBooks = async (userId:string, transaction:Transaction) => {
  //  Get the first ten books -  Assigning The Database has at least 10 books in the database
  const books = await Book.findAll({ limit: 10 });

  // Assign shelves and create UserBook entries
  for (let i=0 ; i<books.length ; i++){
    const book = books[i];
    if (i <= 3){
      await UserBook.create({
        userToken: userId,
        bookId: book.id,
        shelf: 'currentlyReading'
      }, {transaction:transaction});
    }
    else if (i <= 6){
      await UserBook.create({
        userToken: userId,
        bookId: book.id,
        shelf: 'read'
      }, {transaction:transaction});
    }
    else if (i < books.length){
      await UserBook.create({
        userToken: userId,
        bookId: book.id,
        shelf: 'wantToRead'
      }, {transaction:transaction});
    }

  }

  return books;

};
