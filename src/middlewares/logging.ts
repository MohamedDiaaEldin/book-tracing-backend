

import { Request, Response, NextFunction } from 'express'

export const loggingRequest = (req:Request, res:Response, next:NextFunction)=>{
    
    console.log('request headers ', req.headers)
    next()
}