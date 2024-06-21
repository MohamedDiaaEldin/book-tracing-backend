// Assuming you have initialized Sequelize with your database connection
import Book from './src/models/Book';
import User from './src/models/User';
import UserBook from './src/models/UserBooks';
import sequelize from './src/sequelize';
import { PrimaryKey,  } from 'sequelize-typescript';
async function addBookAndUser() {
  try{
    // await sequelize.sync();
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Create a new book
      //   const newBook = await  Book.create({
      //     id: 'book1234',
      //     title: 'The Lord of the Rings',
      //     authors: ['J.R.R. Tolkien'],
      //     smallThumbnail: 'https://...',
      //   },{transaction});
      const newBook = await Book.findByPk('book1234');
      console.log('New Book Is Saved Into The Transaction');

      // Create New User
      //   const newUser = await  User.create({token:'user_token_123'}, {transaction})  ;
      //   console.log('New User Is Saved Into The Transaction')
      const newUser = await User.findByPk('user_token_123');
      if (!newUser || !newBook){
        console.log('There Is no book or user');
        return;
      }
      console.log('user token  is ' , newUser.token);
      //   Associate the book with the user (assuming BelongsToMany relationship)
      const userBook = await UserBook.create({
        userToken: newUser.token ,
        bookId: newBook.id,
        shelf: 'currentlyReading',
      },{transaction});

      console.log('New Association Is Saved Into The Transaction');

      console.log('Before Committing ');
      await transaction.commit(); // Commit the transaction if successful

      console.log('Book and user added successfully!');
    } catch (error) {
      console.error('Error adding book and user:', error);
    }
  }
  catch (error) {
    console.error('Error starting transaction:', error);
  }
}

//   addBookAndUser();

async function readBooks(){
  try{
    const userToken = 'hello';
    const user = await User.findByPk(userToken);
    if (!user) {
      console.log('user not found , sign up ');
      return;
    }

    const userWithBooks = await User.findOne({
      where: { token: user.token },
      include: [
        {
          model: Book,
          through: { attributes: ['shelf'] },
        },
      ],
    });

    console.log('userWithBooks: ', userWithBooks);
    if (!userWithBooks || userWithBooks.books.length === 0 ) {
      console.log('There is No Books with that user');
      return;
    }

    console.log(userWithBooks);

    for (let book of userWithBooks.books) {
      // console.log('Book id : ', book.id , ' book title : ', book.title);
      console.log(book);
    }
    console.log('Done');

  }
  catch(error){
    console.log('Error while Query User Books');
    console.log(error);
  }
}
// addBookAndUser();

readBooks();

const join  = async ()=> {
  const books = await Book.findAll({ include: [{ model: UserBook, where: { userToken: 'hello' } }] });
  console.log(books);
};

// join();