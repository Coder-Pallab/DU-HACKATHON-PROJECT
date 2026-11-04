import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

const isCareerIdentifier = (value) =>
  /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);

export const validateMockInterviewGeneration = [
  body('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom(isCareerIdentifier)
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];

export const validateMockInterviewId = [
  param('interviewId').isMongoId().withMessage('Invalid mock interview ID format'),
  validateRequest,
];

export const validateMockInterviewAnswer = [
  param('interviewId').isMongoId().withMessage('Invalid mock interview ID format'),
  param('questionId').isMongoId().withMessage('Invalid mock interview question ID format'),
  body('answer')
    .isString()
    .trim()
    .isLength({ min: 5, max: 6000 })
    .withMessage('Answer must be between 5 and 6000 characters'),
  validateRequest,
];
