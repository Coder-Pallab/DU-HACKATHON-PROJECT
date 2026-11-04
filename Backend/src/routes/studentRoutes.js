import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import * as aiController from '../controllers/aiController.js';
import * as careerController from '../controllers/careerController.js';
import {
  validateStudentId,
  validateCreateProfile,
  validateUpdateProfile,
  validateUpdateAcademicDetails,
  validateUpdateInterests,
  validateUpdatePreferences,
} from '../validators/studentValidator.js';
import {
  validateAddSkill,
  validateUpdateSkill,
} from '../validators/aiValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireDatabase } from '../middleware/requireDatabase.js';

const router = Router();

// Protect all student routes with JWT authentication
router.use(authenticate);
router.use(requireDatabase);

/**
 * Career Recommendations Endpoints (Section 7)
 */
router.get('/me/recommendations', careerController.getMyRecommendations);
router.post('/me/recommendations/refresh', careerController.refreshMyRecommendations);
router.get('/recommendations', careerController.getMyRecommendations); // Friendly alias
router.post('/recommendations/refresh', careerController.refreshMyRecommendations); // Friendly alias

/**
 * Student Skills Management Endpoints (Section 6)
 * NOTE: Placed before /:id to prevent route shadowing
 */
router.get('/me/skills', aiController.getMySkills);
router.post('/me/skills', validateAddSkill, aiController.addMySkill);
router.patch('/me/skills/:skillId', validateUpdateSkill, aiController.updateMySkill);
router.delete('/me/skills/:skillId', aiController.deleteMySkill);

// Friendly aliases without /me prefix
router.get('/skills', aiController.getMySkills);
router.post('/skills', validateAddSkill, aiController.addMySkill);
router.patch('/skills/:skillId', validateUpdateSkill, aiController.updateMySkill);
router.delete('/skills/:skillId', aiController.deleteMySkill);

/**
 * Student Profile Endpoints
 */
router.get('/me', studentController.getMyProfile);
router.post('/profile', validateCreateProfile, studentController.createProfile);
router.patch('/profile', validateUpdateProfile, studentController.updateProfile);
router.patch('/academic-details', validateUpdateAcademicDetails, studentController.updateAcademicDetails);
router.patch('/interests', validateUpdateInterests, studentController.updateInterests);
router.patch('/preferences', validateUpdatePreferences, studentController.updatePreferences);

// Specific student lookup by ID (ownership / admin / recruiter checked in service)
router.get('/:id', validateStudentId, studentController.getStudentById);

export default router;
