import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateExtractSkills = [
  body('text')
    .optional()
    .isString()
    .trim(),
  body('resumeId')
    .optional()
    .isMongoId()
    .withMessage('Invalid resume ID format'),
  body().custom((val, { req }) => {
    if (!req.body.text && !req.body.resumeId) {
      throw new Error('Please provide either "text" or "resumeId" in the request body');
    }
    return true;
  }),
  validateRequest,
];

export const validateClassifySkills = [
  body('skills')
    .isArray({ min: 1 })
    .withMessage('Skills must be a non-empty array of strings'),
  body('skills.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Skill items cannot be empty strings'),
  validateRequest,
];

export const validateAddSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Skill name must be between 1 and 100 characters'),
  body('proficiency')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Proficiency must be Beginner, Intermediate, Advanced, or Expert'),
  body('category')
    .optional()
    .trim(),
  body('isSoftSkill')
    .optional()
    .isBoolean()
    .withMessage('isSoftSkill must be a boolean'),
  validateRequest,
];

export const validateUpdateSkill = [
  param('skillId')
    .notEmpty()
    .withMessage('Skill ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Skill name must be between 1 and 100 characters'),
  body('proficiency')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Proficiency must be Beginner, Intermediate, Advanced, or Expert'),
  body('category')
    .optional()
    .trim(),
  validateRequest,
];

