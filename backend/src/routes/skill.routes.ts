import { Router } from 'express';
import {
  listSkills,
  getSkillBySlug,
  createSkill,
  publishVersion,
  getSecurityReport,
} from '../controllers/skill.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/skills
 * @desc    List and search skills with pagination
 * @access  Public
 */
router.get('/', listSkills);

/**
 * @route   GET /api/v1/skills/:slug
 * @desc    Get skill details, versions, and ratings by slug
 * @access  Public
 */
router.get('/:slug', getSkillBySlug);

/**
 * @route   POST /api/v1/skills
 * @desc    Create a new skill identity
 * @access  Private (PUBLISHER or ADMIN only)
 */
router.post('/', authenticate, authorize('PUBLISHER', 'ADMIN'), createSkill);

/**
 * @route   POST /api/v1/skills/:slug/versions
 * @desc    Publish a new immutable version with SHA-256 content verification
 * @access  Private (Skill owner or ADMIN only)
 */
router.post(
  '/:slug/versions',
  authenticate,
  authorize('PUBLISHER', 'ADMIN'),
  publishVersion
);

/**
 * @route   GET /api/v1/skills/:slug/versions/:version/security
 * @desc    Get detailed security audit findings and risk score for a skill version
 * @access  Public
 */
router.get('/:slug/versions/:version/security', getSecurityReport);

export const skillRoutes = router;
