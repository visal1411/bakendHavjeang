import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import router from './src/routes/authenroutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import serviceRequestRoutes from './src/routes/x.js';

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'



dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ========== Routes ==========
app.use('/api/auth', router);
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
const swaggerDocument = YAML.load('./openapi.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

console.log('Server now:', new Date());
console.log(swaggerDocument);

startServer();
