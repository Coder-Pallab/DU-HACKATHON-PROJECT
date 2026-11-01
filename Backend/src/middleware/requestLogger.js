import morgan from 'morgan';
import { isProduction } from '../config/env.js';

/**
 * HTTP Request Logging Middleware using Morgan
 */
export const requestLogger = isProduction()
  ? morgan('combined')
  : morgan(':method :url :status :res[content-length] - :response-time ms');

