import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import connectDB from './config/db';
import alertRoutes from './routes/alerts';
import userRoutes from './routes/users';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

connectDB();
app.use( express.static('public'))
app.use(express.json());
app.use('/', userRoutes);
console.log('app routing hit')
app.use('/api/alerts', alertRoutes);
console.log('app end hit')
export default app;
