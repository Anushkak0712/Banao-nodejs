import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db';
import alertRoutes from './routes/alerts';


const app = express();

connectDB();

app.use(express.json());
app.use('/api/alerts', alertRoutes);

export default app;
