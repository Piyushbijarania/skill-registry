import { Router } from 'express';
import {
  submitReview,
  listReviews,
  voteSkill,
  createCollection,
  listMyCollections,
  addSkillToCollection,
} from '../controllers/community.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// --- Reviews & Ratings Endpoints ---
router.post('/skills/:slug/reviews', authenticate, submitReview);
router.get('/skills/:slug/reviews', listReviews);

// --- Voting Endpoints ---
router.post('/skills/:slug/vote', authenticate, voteSkill);

// --- Personal Collections Endpoints ---
router.post('/collections', authenticate, createCollection);
router.get('/collections/me', authenticate, listMyCollections);
router.post('/collections/:id/skills', authenticate, addSkillToCollection);

export const communityRoutes = router;

