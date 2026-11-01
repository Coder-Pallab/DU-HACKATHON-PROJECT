import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Middleware to evaluate express-validator result and return standard API error format
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Request validation failed',
      errors: formattedErrors,
    });
  }
  next();
};

