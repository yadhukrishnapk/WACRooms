import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!!');
}).catch((error) => {
    console.log(error);
});


const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];


app.use(cors({
   origin: function (origin, callback) {
       if (!origin || allowedOrigins.includes(origin)) {
           callback(null, true);
       } else {
           callback(new Error("Not allowed by CORS"));
       }
   },
   credentials: true
}));


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use((err, req, res, next) => {
const statusCode = err.statusCode || 500;
const message = err.message || "Something went wrong";
return res.status(statusCode).json({ 
    success: false,
    statusCode,
    message,
 });
}
);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})