const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const secretKey = process.env.JWT_SECRET; // Retrieve JWT secret key from environment variables
const algorithms = 'HS256'; // Algorithm used for JWT
// const expiresIn = '2d'; // Token expiration time (e.g., 30 weeks)

// Function to verify the validity of a received JWT token
export const verify = (receivedToken:string) => {
  try {
    jwt.verify(receivedToken, secretKey, { algorithms: algorithms });
    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid
  }
};

export interface Payload {
    randomToken: string
}

// Receive JWT Token
// TODO Return Payload - Object with random random token
export const decode = (token:string):Payload | null  =>  {
  try{
    return jwt.decode(token);
  }
  catch(error){
    return null ;
  }
};

// Function to sign a JWT token with provided payload
export const  sign =  (payload:Payload) => {
  return jwt.sign(payload, secretKey, { algorithm: algorithms});
};
