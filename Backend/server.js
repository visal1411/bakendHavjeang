import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authenroutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import serviceRequestRoutes from './src/routes/x.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/servicerequests', serviceRequestRoutes);

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

console.log('Server now:', new Date());
startServer();
