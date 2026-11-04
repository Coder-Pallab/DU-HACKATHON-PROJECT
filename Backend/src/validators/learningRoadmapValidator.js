import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

const isCareerIdentifier = (value) =>
  /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);

export const validateRoadmapGeneration = [
  body('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom(isCareerIdentifier)
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];

export const validateRoadmapCareerId = [
  param('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom(isCareerIdentifier)
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];

export const validateRoadmapPhaseProgress = [
  param('roadmapId').isMongoId().withMessage('Invalid roadmap ID format'),
  param('phaseId').isMongoId().withMessage('Invalid roadmap phase ID format'),
  body('status')
    .isIn(['not_started', 'in_progress', 'completed'])
    .withMessage('Status must be not_started, in_progress, or completed'),
  validateRequest,
];
