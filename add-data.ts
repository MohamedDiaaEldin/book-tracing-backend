import { title } from "process";
import Book from "./src/models/Book";
import sequelize from "./src/sequelize";

const addBook = async () => {
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    
    // Create a new Book instance with the data you want to add
    const newBook = new Book({
      id: "jsdfasjl",
      title: "Sample Book",
      authors: ["Author 1", "Author 2"],
      smallThumbnail: "thumbnail-url",
    });
    
    // Save the new Book instance within the transaction
    await newBook.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    console.log('New book added:', newBook.toJSON());
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();

    console.error('Error adding book:', error);
  }
};

// Call the addBook function to add a book with a transaction
// addBook();




async function readBooks() {
    try {
      // Ensure the database is in sync
      await sequelize.sync();
  
      // Read all books from the table
      const books = await Book.findAll();
  
    //   console.log('Books:', books.map((book) => book.toJSON()));
    const first = books[0]
    console.log(first.authors)
      
    } catch (error) {
      console.error('Error reading books:', error);
    } finally {
      // Close the connection
      await sequelize.close();
    }
  }
  
  readBooks();