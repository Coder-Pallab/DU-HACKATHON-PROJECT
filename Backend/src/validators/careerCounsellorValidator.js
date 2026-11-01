import { body, param, query } from 'express-validator';
import { ALL_LANGUAGES } from '../constants/languages.js';
import { validateRequest } from './validateRequest.js';

export const validateCounsellingMessage = [
  body('message')
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 4000 })
    .withMessage('Message cannot exceed 4000 characters'),
  body('conversationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid conversation ID format'),
  body('language')
    .optional()
    .isIn(ALL_LANGUAGES)
    .withMessage(`Language must be one of: ${ALL_LANGUAGES.join(', ')}`),
  validateRequest,
];

export const validateConversationId = [
  param('conversationId').isMongoId().withMessage('Invalid conversation ID format'),
  validateRequest,
];

export const validateConversationPagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validateRequest,
];
