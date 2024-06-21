import { Request, Response, NextFunction } from "express";



const searchValidator = (req: Request, res: Response, next: NextFunction) => {
  const { word, maxResults } = req.body;
  if (!word || !maxResults) {
    return res.status(400).json({ message: "Word and maxResults are required" });
  }
  next();
};

export default searchValidator;