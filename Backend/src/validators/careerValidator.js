import { param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateCareerId = [
  param('id')
    .custom((value) => {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(value);
      const isSlug = /^[a-z0-9-]+$/.test(value);
      if (!isMongoId && !isSlug) {
        throw new Error('Career identifier must be a valid MongoDB ObjectId or URL slug');
      }
      return true;
    }),
  validateRequest,
];

