import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { wss } from './webSocket/webSocket.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import eventRouter from './routes/event.route.js';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB!!'))
  .catch((error) => console.log(error));

  const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ["http://localhost:5173", "http://localhost:5174"];

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
app.use("/api/event", eventRouter);

// Serve static files with explicit MIME types
app.use(express.static(path.join(__dirname, 'client', 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
