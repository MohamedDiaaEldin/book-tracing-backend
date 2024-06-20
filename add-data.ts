import Book from './src/models/Book';
import sequelize from './src/sequelize';
import fs from 'fs';
import { BookAttributes } from './src/models/Book';
import { Transaction } from 'sequelize';

interface BookI extends BookAttributes {
    imageLinks : {
        smallThumbnail :string
    }
 }

let transaction: Transaction | null = null;

const addBooks = async () => {
  try {
    const booksStr = fs.readFileSync('./books.json', 'utf-8');
    const books: BookI[] = JSON.parse(booksStr);
    console.log('Number of Book  is : ', books.length);

    transaction = await sequelize.transaction();
    for (const book of books) {
      try {

        console.log('Currently reading Book with id ', book.id );
        const newBook = new Book({
          id: book.id,
          title: book.title,
          authors: book.authors,
          smallThumbnail: book.imageLinks.smallThumbnail
        });

        await newBook.save({ transaction });
        console.log('Book ', newBook.title, ' Is SAVED Into Transaction');

      } catch (error) {

        //  if (transaction !== null) await transaction.rollback();
        console.error('Error adding book:', error);
      }

    }
    await transaction.commit();
  } catch (error) {
    console.error('Error reading file:', error);
  } finally {
    if (transaction !== null) {
      await sequelize.close(); // Close the connection only after all operations are done
    }
  }

};

addBooks();

async function readBooks() {
  try {
    // Ensure the database is in sync
    await sequelize.sync();

    // Read all books from the table
    const books = await Book.findAll();

    //   console.log('Books:', books.map((book) => book.toJSON()));

  } catch (error) {
    console.error('Error reading books:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}
