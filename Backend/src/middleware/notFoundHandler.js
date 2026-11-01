import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`,
    errors: [
      {
        path: req.originalUrl,
        method: req.method,
        message: 'Endpoint does not exist on this server',
      },
    ],
  });
};

