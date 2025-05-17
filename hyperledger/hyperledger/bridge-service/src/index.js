const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Import routes
const fabricRoutes = require('./routes/fabric');
const solanaRoutes = require('./routes/solana');
const bridgeRoutes = require('./routes/bridge');

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'nivix-bridge' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/fabric', fabricRoutes);
app.use('/api/solana', solanaRoutes);
app.use('/api/bridge', bridgeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Nivix Bridge Service API',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Nivix Bridge Service running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Bridge service shutting down');
  process.exit(0);
});

module.exports = app; 