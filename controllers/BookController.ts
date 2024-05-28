import { Response, Request } from "express";
import Book from "../src/models/Book";
import sequelize from "../src/sequelize";



/**
 * Retrieves a list of books from the database and sends it as a JSON response.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {    
    try {
        // Ensure the database is in sync
        await sequelize.sync();

        // Read all books from the table
        const books = await Book.findAll({ limit: 10 });
        
        res.json(books);
    } catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
