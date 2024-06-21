import { Request, Response, NextFunction } from "express";




/**
 * @description Validate the search query and maxResults that are passed in the body of the request
 * @returns 400 if the query or maxResults is not provided
 */
const searchValidator = (req: Request, res: Response, next: NextFunction) => {
  const { query, maxResults } = req.body;
  if (!query || !maxResults) {
    return res.status(400).json({ message: "Word and maxResults are required" });
  }
  next();
};

export default searchValidator;