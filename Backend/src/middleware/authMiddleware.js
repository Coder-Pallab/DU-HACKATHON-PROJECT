import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from './asyncHandler.js';
import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes and verify JWT Access Token
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Bearer token missing.');
  }

  // Verify access token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Authentication token has expired. Please refresh your token or log in again.');
    }
    throw ApiError.unauthorized('Invalid authentication token.');
  }

  // Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('The user belonging to this token no longer exists.');
  }

  // Check if account is active
  if (!user.isActive) {
    throw ApiError.forbidden('User account has been deactivated. Please contact support.');
  }

  // Check if password was changed after token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    throw ApiError.unauthorized('Password was recently changed. Please log in again.');
  }

  // Attach user to request object
  req.user = user;
  next();
});

/**
 * Middleware for Role-Based Access Control (RBAC)
 * @param  {...string} roles - Permitted roles (e.g. 'Admin', 'Recruiter', 'Student')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

