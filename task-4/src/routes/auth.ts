import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET||'';

interface Payload {
   username: string;
}

function generateToken(payload: Payload): string {
  const token: string = jwt.sign(payload, JWT_SECRET);
  return token;
}

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  // Check if the user has token in cookies. If not return the request;
  if (!req.cookies.jwt) return res.redirect('/login');
  const clientToken: string = req.cookies.jwt;

  try {
    // Decode the client token by using same secret key that we used to sign the token
    const decoded: JwtPayload = jwt.verify(clientToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.json({ error: 'Invalid Token' });
    return res.redirect('/login');
  }
}

export { generateToken, isLoggedIn };