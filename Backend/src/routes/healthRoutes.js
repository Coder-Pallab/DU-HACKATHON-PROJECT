import { Router } from 'express';
import { getHealthStatus, ping } from '../controllers/healthController.js';

const router = Router();

router.get('/health', getHealthStatus);
router.get('/ping', ping);

export default router;

