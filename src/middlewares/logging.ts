

import { Request, Response, NextFunction } from 'express'

export const loggingRequest = (req:Request, res:Response, next:NextFunction)=>{
    const body = req.body
    const contentType = req.headers['content-type']
    const userAgent = req.headers['user-agent']
    console.log('LOGGING.. ', '- Request Body: ', body, ' - Request Content Type: ', contentType, ' - Request User Agent: ', userAgent)
    next()
}