import { param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateResumeId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid resume ID format'),
  validateRequest,
];

