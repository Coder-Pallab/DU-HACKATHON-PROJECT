import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateRefreshToken,
} from '../validators/authValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireDatabase } from '../middleware/requireDatabase.js';

const router = Router();

/**
 * Public Authentication Routes (with rate-limiting)
 */
router.post('/register', authLimiter, requireDatabase, validateRegister, authController.register);
router.post('/login', authLimiter, requireDatabase, validateLogin, authController.login);
router.post(
  '/forgot-password',
  authLimiter,
  requireDatabase,
  validateForgotPassword,
  authController.forgotPassword
);
router.post('/reset-password', requireDatabase, validateResetPassword, authController.resetPassword);
router.post('/refresh-token', requireDatabase, validateRefreshToken, authController.refreshToken);

/**
 * Protected Authentication Routes (JWT required)
 */
router.get('/me', authenticate, requireDatabase, authController.getMe);
router.post('/logout', authenticate, requireDatabase, authController.logout);
router.patch(
  '/change-password',
  authenticate,
  requireDatabase,
  validateChangePassword,
  authController.changePassword
);

export default router;
