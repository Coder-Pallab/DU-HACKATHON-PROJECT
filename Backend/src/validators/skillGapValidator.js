import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

const isCareerIdentifier = (value) =>
  /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);

export const validateSkillGapRequest = [
  body('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom(isCareerIdentifier)
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];

export const validateSkillGapCareerId = [
  param('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom(isCareerIdentifier)
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];
