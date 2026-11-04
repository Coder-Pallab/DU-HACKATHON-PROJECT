import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { isProduction } from '../config/env.js';

/**
 * Centralized Application Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || RESPONSE_MESSAGES.SERVER_ERROR;
  let errors = Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : [];

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid resource identifier format for field '${err.path}'`;
    errors = [{ field: err.path, message: `Invalid identifier: ${err.value}` }];
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Database validation failed';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const duplicatedKeys = Object.keys(err.keyValue || {});
    const duplicateKey = duplicatedKeys[0] || 'field';
    const duplicateVal = err.keyValue ? err.keyValue[duplicateKey] : '';
    message = `Duplicate value '${duplicateVal}' for unique field '${duplicateKey}'`;
    errors = [{ field: duplicateKey, message: `${duplicateKey} already exists` }];
  }

  // Handle JWT Malformed / Invalid Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid authentication token provided';
    errors = [{ message: 'Token is malformed or invalid' }];
  }

  // Handle JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Authentication token has expired. Please refresh or re-login.';
    errors = [{ message: 'Token expired' }];
  }

  // Handle Multer File Upload Errors
  if (err.name === 'MulterError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum allowed size limit';
    } else {
      message = `File upload error: ${err.message}`;
    }
    errors = [{ code: err.code, message: err.message }];
  }

  // Handle JSON Syntax Error in request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Malformed JSON in request payload';
    errors = [{ message: 'Please provide valid JSON body' }];
  }

  // Log error stack trace in non-production environments
  if (!isProduction()) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
      statusCode,
      message,
      errors,
      stack: err.stack,
    });
  } else {
    // In production, avoid leaking internal server errors
    if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      message = RESPONSE_MESSAGES.SERVER_ERROR;
      errors = [];
    }
  }

  // Strict User-Specified Error Response Format:
  // { "success": false, "message": "...", "errors": [] }
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

