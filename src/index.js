import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { initializeDatabase, sequelize } from './config/database.js';
import './models/user.model.js';
import config from './config/environment.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/auth.middleware.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      status: 404,
      message: 'Route not found',
    },
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Initialize database and create it if needed
    await initializeDatabase();

    // Authenticate and sync models with database
    await sequelize.authenticate();
    console.log('✓ Database connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('✓ Database tables synchronized.');

    app.listen(config.port, () => {
      console.log(`\n🚀 Auth service listening on port ${config.port}`);
      console.log(`📦 Environment: ${config.env}`);
      console.log(`🗄️  Database: ${config.db.name}\n`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

export default app;
