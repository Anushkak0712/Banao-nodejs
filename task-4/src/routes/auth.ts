import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express';
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET||'secret';

interface Payload {
   username: string;
}

function generateToken(payload: JwtPayload): string {
  const token: string = jwt.sign(payload, JWT_SECRET);
  return token;
}

function authenticateJWT(req: Request, res: Response, next: NextFunction){
    //console.log(typeof(req.cookies))
    //console.log(req.cookies)
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
  const decoded=jwt.verify(token, JWT_SECRET);
  req.user = decoded;
    next();
}catch(error){
    console.log(error)
      return res.status(403).json({ message: 'Token verification failed' });
    }
  };

export { generateToken, authenticateJWT };
