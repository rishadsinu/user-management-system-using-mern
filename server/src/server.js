import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js'

import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});