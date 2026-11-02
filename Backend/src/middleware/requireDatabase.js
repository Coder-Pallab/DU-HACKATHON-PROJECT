import { getDatabaseStatus } from '../config/db.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const requireDatabase = (req, res, next) => {
  if (getDatabaseStatus().isConnected) {
    return next();
  }

  return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
    success: false,
    message: 'Database is unavailable. Check the MongoDB connection and try again.',
    errors: [],
  });
};
