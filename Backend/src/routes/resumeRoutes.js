import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';
import { validateResumeId } from '../validators/resumeValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireDatabase } from '../middleware/requireDatabase.js';

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
router.delete('/:id', validateResumeId, resumeController.deleteResume);

export default router;
