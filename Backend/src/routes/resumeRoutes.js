import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';
import { validateResumeId } from '../validators/resumeValidator.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { requireDatabase } from '../middleware/requireDatabase.js';
import { ROLES } from '../constants/roles.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import * as resumeIntelligenceController from '../controllers/resumeIntelligenceController.js';
import {
  validateResumeCompatibility,
  validateResumeImprovementDraft,
  validateResumeImprovementDraftUpdate,
  validateResumeIntelligenceAnalysis,
} from '../validators/resumeIntelligenceValidator.js';

const router = Router();

// Protect all resume routes with JWT authentication
router.use(authenticate);
router.use(requireDatabase);

/**
 * Resume Management Endpoints
 */
router.post('/upload', uploadResumeFile.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getResumes);
router.get('/:id', validateResumeId, resumeController.getResumeById);
router.get('/:id/download', validateResumeId, resumeController.downloadResume);
router.post('/:id/parse', validateResumeId, resumeController.parseResume);
router.post('/:id/analyze', validateResumeId, resumeController.analyzeResume);
router.post(
  '/:id/intelligence/analyze',
  authorize(ROLES.STUDENT),
  aiLimiter,
  validateResumeIntelligenceAnalysis,
  resumeIntelligenceController.analyzeResume
);
router.get(
  '/:id/intelligence/analyses',
  authorize(ROLES.STUDENT),
  validateResumeId,
  resumeIntelligenceController.listAnalyses
);
router.post(
  '/:id/intelligence/compatibility',
  authorize(ROLES.STUDENT),
  aiLimiter,
  validateResumeCompatibility,
  resumeIntelligenceController.compareCompatibility
);
router.post(
  '/:id/intelligence/analyses/:analysisId/improvements',
  authorize(ROLES.STUDENT),
  aiLimiter,
  validateResumeImprovementDraft,
  resumeIntelligenceController.createImprovementDraft
);
router.patch(
  '/:id/intelligence/analyses/:analysisId/improvements/:draftId',
  authorize(ROLES.STUDENT),
  validateResumeImprovementDraftUpdate,
  resumeIntelligenceController.updateImprovementDraft
);
router.delete('/:id', validateResumeId, resumeController.deleteResume);

export default router;
