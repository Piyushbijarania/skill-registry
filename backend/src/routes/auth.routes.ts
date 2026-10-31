import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user account (Developer or Publisher)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return JWT access token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user profile and activity stats
 * @access  Private (Requires Bearer Token)
 */
router.get('/me', authenticate, getMe);

export const authRoutes = router;

