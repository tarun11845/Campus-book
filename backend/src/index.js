import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from './lib/db.js';

import authRoutes from './routes/auth.js';
import slotRoutes from './routes/slots.js';
import bookingRoutes from './routes/bookings.js';
import sportRoutes from './routes/sport.js';
import facilityRoutes from './routes/facility.js';

import './services/slotCleanupService.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://campus-book-grxp.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
//app.options('/(.*)', cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error('Server failed to start', err);
  process.exit(1);
});
