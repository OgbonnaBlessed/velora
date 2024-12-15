import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js'
import uploadRoutes from './routes/upload.routes.js'; // Import upload routes
import cookieParser from 'cookie-parser';
import flightSearchRoutes from './routes/flight.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log('MongoDB is connected');
})
.catch((err) => {
    console.log(err)
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes); // Use the upload routes
app.use('/api/flight', flightSearchRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});