import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as authService from '../services/authService.js';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const result = await authService.register({ name, email, password, phone });

  return ApiResponse.success(
    res,
    result,
    'Registration successful. Welcome to AI Career Guidance Platform!',
    HTTP_STATUS.CREATED
  );
});

/**
 * Log in user and receive JWT tokens
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  return ApiResponse.success(res, result, 'Login successful');
});

/**
 * Log out user and revoke refresh token
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  return ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * Request password reset token
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  return ApiResponse.success(res, result, result.message);
});

/**
 * Reset password using token
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshTokens(refreshToken);

  return ApiResponse.success(res, result, 'Access token refreshed successfully');
});

/**
 * Get profile of currently logged-in user
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  return ApiResponse.success(res, { user }, 'User profile retrieved successfully');
});

/**
 * Change password of authenticated user
 * PATCH /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);

  return ApiResponse.success(res, null, result.message);
});
