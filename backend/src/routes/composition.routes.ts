import { Router } from 'express';
import { composeSkills, generateSkill } from '../controllers/composition.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/composition/compose
 * @desc    Compose multiple existing skills into a new unified skill bundle with provenance tracking
 * @access  Private (Requires login)
 */
router.post('/compose', authenticate, composeSkills);

/**
 * @route   POST /api/v1/composition/generate
 * @desc    Generate a custom skill from natural language prompt
 * @access  Private (Requires login)
 */
router.post('/generate', authenticate, generateSkill);

export const compositionRoutes = router;

