import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { assertRuntimeConfig, ENV } from './config/env.js';
import { connectDB, getDatabaseStatus } from './config/db.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();
assertRuntimeConfig();
let databaseConnectionPromise;

if (process.env.VERCEL) {
  app.set('trust proxy', 1);
}

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matching CLIENT_URL
    if (!origin || ENV.CLIENT_URLS.includes(origin) || ENV.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

if (process.env.VERCEL) {
  app.use(async (_req, res, next) => {
    if (getDatabaseStatus().isConnected) return next();

    try {
      if (!databaseConnectionPromise) {
        databaseConnectionPromise = connectDB().finally(() => {
          databaseConnectionPromise = null;
        });
      }
      await databaseConnectionPromise;
      return next();
    } catch (error) {
      console.error(`[MongoDB] Serverless connection failed: ${error.message}`);
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Check the MongoDB connection and try again.',
        errors: [],
      });
    }
  });
}

// Request logging
app.use(requestLogger);

// Global rate limiter
app.use(generalLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI-Powered Career Guidance & Placement Assistance Platform API',
    data: {
      apiVersion: 'v1',
      apiPrefix: '/api/v1',
      healthEndpoint: '/api/v1/health',
      environment: ENV.NODE_ENV,
    },
  });
});

// Mount Versioned API Routes (/api/v1)
app.use('/api/v1', apiRouter);

// 404 Not Found Middleware
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
