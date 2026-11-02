import { Router } from 'express';
import * as careerController from '../controllers/careerController.js';
import { validateCareerId } from '../validators/careerValidator.js';
import { requireDatabase } from '../middleware/requireDatabase.js';

const router = Router();
router.use(requireDatabase);

/**
 * Public Career Catalog Endpoints
 */
router.get('/', careerController.getAllCareers);
router.get('/:id', validateCareerId, careerController.getCareerById);

export default router;
