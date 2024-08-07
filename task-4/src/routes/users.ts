import express from 'express';
import { generateToken, authenticateJWT } from './auth';
const router = express.Router();
import bcrypt from 'bcrypt';
import path from 'path';
import jwt from 'jsonwebtoken'
import User from '../models/User';
const JWT_SECRET: string = process.env.JWT_SECRET||'secret';
router.get('/',(req,res)=>{
    console.log(__dirname)
    res.sendfile('index.html')
})

router.post('/register',  async (req, res)=>{
    const { email, password } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = {
      email,
      password: hashedPassword,alerts:[]
    }
    const newUser = await User.create(user);
    if (newUser){
        const token = jwt.sign(user.email, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({user:user.email,token})
    }else{
        res.status(500).json({message:'user not created'})
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    // Find the user by email
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
  
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Generate a new token
    const token = jwt.sign(user.email, JWT_SECRET);
  
    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true });
  
    res.status(200).json({ user: user.email, token });
  });
  router.post('/logout', async (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
// Protected route
router.get('/profile', authenticateJWT, (req, res) => {
    res.redirect('profile.html')
});
export default router;