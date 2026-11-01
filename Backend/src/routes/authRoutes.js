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

const router = Router();

/**
 * Public Authentication Routes (with rate-limiting)
 */
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/forgot-password', authLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, authController.resetPassword);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

/**
 * Protected Authentication Routes (JWT required)
 */
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);
router.patch('/change-password', authenticate, validateChangePassword, authController.changePassword);

export default router;

