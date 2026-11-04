import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

const isCareerIdentifier = (value) =>
  /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);

const validateResumeAndAnalysisIds = [
  param('id').isMongoId().withMessage('Invalid resume ID format'),
  param('analysisId').isMongoId().withMessage('Invalid resume analysis ID format'),
];

export const validateResumeIntelligenceAnalysis = [
  param('id').isMongoId().withMessage('Invalid resume ID format'),
  body('careerId')
    .optional()
    .trim()
    .custom(isCareerIdentifier)
    .withMessage('Career ID must be a MongoDB ObjectId or career slug'),
  validateRequest,
];

export const validateResumeCompatibility = [
  param('id').isMongoId().withMessage('Invalid resume ID format'),
  body('careerId')
    .optional()
    .trim()
    .custom(isCareerIdentifier)
    .withMessage('Career ID must be a MongoDB ObjectId or career slug'),
  body('jobDescription')
    .optional()
    .trim()
    .isLength({ min: 50, max: 20000 })
    .withMessage('Job description must be between 50 and 20000 characters'),
  body().custom((value) => Boolean(value?.careerId) !== Boolean(value?.jobDescription))
    .withMessage('Provide either careerId or jobDescription, but not both'),
  validateRequest,
];

export const validateResumeImprovementDraft = [
  ...validateResumeAndAnalysisIds,
  body('kind')
    .isIn([
      'professionalSummary',
      'projectDescription',
      'resumeBullet',
      'experienceDescription',
      'skillSuggestions',
      'missingSections',
      'readability',
    ])
    .withMessage('Unsupported resume improvement type'),
  body('sourceText')
    .optional()
    .isString()
    .isLength({ max: 3000 })
    .withMessage('Source text cannot exceed 3000 characters'),
  body('projectIndex')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Project index must be an integer between 0 and 100'),
  body('careerId')
    .optional()
    .trim()
    .custom(isCareerIdentifier)
    .withMessage('Career ID must be a MongoDB ObjectId or career slug'),
  validateRequest,
];

export const validateResumeImprovementDraftUpdate = [
  ...validateResumeAndAnalysisIds,
  param('draftId').isMongoId().withMessage('Invalid improvement draft ID format'),
  body('editedContent')
    .optional()
    .isString()
    .isLength({ min: 1, max: 4000 })
    .withMessage('Edited content must be between 1 and 4000 characters'),
  body('status')
    .optional()
    .isIn(['accepted', 'dismissed'])
    .withMessage('Draft status must be accepted or dismissed'),
  body().custom((value) => value?.editedContent !== undefined || value?.status !== undefined)
    .withMessage('Provide editedContent or status'),
  validateRequest,
];
