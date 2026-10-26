import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Get service health, uptime, and system diagnostics
 * @access  Public
 */
router.get('/', getHealthStatus);

export const healthRoutes = router;
