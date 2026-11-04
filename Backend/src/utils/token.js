import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

/**
 * Generate JWT Access Token
 * @param {object} payload - Data to embed in the token (e.g., { id, role, email })
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRY,
  });
};

/**
 * Generate JWT Refresh Token
 * @param {object} payload - Data to embed in the token (e.g., { id })
 * @returns {string} Signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRY,
  });
};

/**
 * Verify JWT Access Token
 * @param {string} token - Access token to verify
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};

/**
 * Hash a plain token using SHA-256 (for password reset and refresh token verification)
 * @param {string} token - Plain token string
 * @returns {string} Hex-encoded SHA-256 hash
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a random cryptographically secure token string (for password reset)
 * @param {number} bytes - Byte length (default: 32)
 * @returns {string} Hex token string
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

