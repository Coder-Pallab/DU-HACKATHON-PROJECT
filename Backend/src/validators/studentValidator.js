import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';
import { ALL_LANGUAGES } from '../constants/languages.js';

export const validateStudentId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid student or user ID format'),
  validateRequest,
];

export const validateCreateProfile = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
  body('college')
    .optional()
    .trim(),
  body('university')
    .optional()
    .trim(),
  body('degree')
    .optional()
    .trim(),
  body('department')
    .optional()
    .trim(),
  body('semester')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be an integer between 1 and 12'),
  body('graduationYear')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Graduation year must be between 2000 and 2100'),
  body('cgpa')
    .optional()
    .isFloat({ min: 0.0, max: 10.0 })
    .withMessage('CGPA must be a decimal between 0.0 and 10.0'),
  body('preferredLanguage')
    .optional()
    .isIn(ALL_LANGUAGES)
    .withMessage(`Preferred language must be one of: ${ALL_LANGUAGES.join(', ')}`),
  validateRequest,
];

export const validateUpdateProfile = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('socialLinks must be an object'),
  body('socialLinks.github')
    .optional()
    .trim(),
  body('socialLinks.linkedin')
    .optional()
    .trim(),
  body('socialLinks.portfolio')
    .optional()
    .trim(),
  validateRequest,
];

export const validateUpdateAcademicDetails = [
  body('college')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('College cannot be empty if provided'),
  body('university')
    .optional()
    .trim(),
  body('degree')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Degree cannot be empty if provided'),
  body('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty if provided'),
  body('semester')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be an integer between 1 and 12'),
  body('graduationYear')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Graduation year must be between 2000 and 2100'),
  body('cgpa')
    .optional()
    .isFloat({ min: 0.0, max: 10.0 })
    .withMessage('CGPA must be between 0.0 and 10.0'),
  validateRequest,
];

export const validateUpdateInterests = [
  body('technicalSkills')
    .optional()
    .isArray()
    .withMessage('Technical skills must be an array'),
  body('technicalSkills.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name is required for each technical skill'),
  body('technicalSkills.*.proficiency')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Proficiency must be Beginner, Intermediate, Advanced, or Expert'),
  body('softSkills')
    .optional()
    .isArray()
    .withMessage('Soft skills must be an array of strings'),
  body('softSkills.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Soft skill entries cannot be empty strings'),
  body('careerInterests')
    .optional()
    .isArray()
    .withMessage('Career interests must be an array of strings'),
  body('careerInterests.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Career interest entries cannot be empty strings'),
  validateRequest,
];

export const validateUpdatePreferences = [
  body('preferredLanguage')
    .notEmpty()
    .withMessage('Preferred language is required')
    .isIn(ALL_LANGUAGES)
    .withMessage(`Preferred language must be one of: ${ALL_LANGUAGES.join(', ')}`),
  validateRequest,
];

export const validatePlacementReadinessRequest = [
  body('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom((value) =>
      /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
    )
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];

export const validatePlacementReadinessCareerId = [
  param('careerId')
    .trim()
    .notEmpty()
    .withMessage('Career ID or slug is required')
    .custom((value) =>
      /^[0-9a-fA-F]{24}$/.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
    )
    .withMessage('Career identifier must be a valid MongoDB ObjectId or URL slug'),
  validateRequest,
];
