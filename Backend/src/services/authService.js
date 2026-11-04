import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken,
} from '../utils/token.js';
import { isProduction } from '../config/env.js';
import { ROLES } from '../constants/roles.js';

/**
 * Register a new user
 */
export const register = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists');
  }

  const user = new User({
    name,
    email,
    password,
    role: ROLES.STUDENT,
    phone: phone || '',
  });

  // Generate tokens
  const tokenPayload = { id: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ id: user._id });

  // Store hashed refresh token
  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Log in an existing user
 */
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +isActive +refreshToken');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload = { id: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ id: user._id });

  // Update refresh token and last login
  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  // Strip sensitive password and tokens from returned object
  const sanitizedUser = user.toJSON();

  return {
    user: sanitizedUser,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Log out a user by clearing refresh token
 */
export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  return true;
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (rawRefreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(rawRefreshToken);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.');
  }

  const hashedToken = hashToken(rawRefreshToken);
  const user = await User.findOne({ _id: decoded.id, refreshToken: hashedToken }).select('+refreshToken');

  if (!user) {
    throw ApiError.unauthorized('Refresh token is invalid or has been revoked');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  // Issue new tokens (Token Rotation)
  const tokenPayload = { id: user._id, role: user.role, email: user.email };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Initiate forgot password process
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Return standard message to prevent email enumeration attacks
    return {
      message: 'If an account with this email exists, a password reset token has been issued.',
    };
  }

  const rawResetToken = generateRandomToken(32);
  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

  await user.save({ validateBeforeSave: false });

  const result = {
    message: 'Password reset token generated successfully. Valid for 15 minutes.',
  };

  // In non-production, return token directly for easy testing in Postman
  if (!isProduction()) {
    result.resetToken = rawResetToken;
    result.expiresAt = user.passwordResetExpires;
  }

  return result;
};

/**
 * Reset password using reset token
 */
export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw ApiError.badRequest('Password reset token is invalid or has expired');
  }

  // Update password and clear reset fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // Force logout on other sessions

  await user.save();

  return {
    message: 'Password has been reset successfully. Please log in with your new password.',
  };
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshToken = undefined; // Invalidate refresh tokens on password change
  await user.save();

  return {
    message: 'Password changed successfully. Please log in with your new credentials.',
  };
};

/**
 * Get profile of currently authenticated user
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};
