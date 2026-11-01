import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { ENV } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matching CLIENT_URL
    if (!origin || origin === ENV.CLIENT_URL || ENV.NODE_ENV === 'development') {
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

// Request logging
app.use(requestLogger);

// Global rate limiter
app.use(generalLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded files (if local storage fallback is used)
const uploadsDirectory = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDirectory));

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

