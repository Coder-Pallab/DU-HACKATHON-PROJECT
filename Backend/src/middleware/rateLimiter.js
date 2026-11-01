import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Standard factory for rate limiter error handler
 */
const createRateLimitResponse = (message) => (req, res) => {
  res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    success: false,
    message,
    errors: [
      {
        path: req.originalUrl,
        message: 'Rate limit exceeded. Please retry after some time.',
      },
    ],
  });
};

/**
 * General API Rate Limiter
 * 300 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many requests. Please slow down.'),
});

/**
 * Authentication Route Rate Limiter (Protection against brute force)
 * 20 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many authentication attempts. Please try again in 15 minutes.'),
});

/**
 * AI Endpoint Rate Limiter (Gemini operations cost & quota management)
 * 30 requests per 1 minute per IP
 */
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('AI processing rate limit reached. Please wait a moment before sending another request.'),
});

