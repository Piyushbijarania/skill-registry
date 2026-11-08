import { Router } from 'express';
import { discoverSkills } from '../controllers/discovery.controller';

const router = Router();

/**
 * @route   POST /api/v1/discovery
 * @desc    Natural language skill discovery grounded in indexed registry records
 * @access  Public
 */
router.post('/', discoverSkills);

export const discoveryRoutes = router;

