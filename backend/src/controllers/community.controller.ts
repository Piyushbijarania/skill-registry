import { Request, Response, NextFunction } from 'express';
import { communityService } from '../services/community.service';
import {
  submitReviewSchema,
  voteSkillSchema,
  createCollectionSchema,
  addSkillToCollectionSchema,
} from '../types/community.types';
import { sendSuccess } from '../utils/apiResponse';

/**
 * Controller: Submit or update a skill review
 * @route POST /api/v1/skills/:slug/reviews
 */
export const submitReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const validatedInput = submitReviewSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await communityService.submitReview(userId, slug, validatedInput);

    sendSuccess(res, result, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: List reviews for a skill
 * @route GET /api/v1/skills/:slug/reviews
 */
export const listReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await communityService.listReviews(slug, page, limit);

    sendSuccess(res, result.reviews, 'Reviews retrieved successfully', 200, {
      summary: result.summary,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Vote on a skill (+1 or -1)
 * @route POST /api/v1/skills/:slug/vote
 */
export const voteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const { voteValue } = voteSkillSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await communityService.voteSkill(userId, slug, voteValue);

    sendSuccess(res, result, 'Vote recorded successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Create personal collection
 * @route POST /api/v1/collections
 */
export const createCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = createCollectionSchema.parse(req.body);
    const userId = req.user!.id;

    const collection = await communityService.createCollection(userId, validatedInput);

    sendSuccess(res, collection, 'Collection created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: List current user's collections
 * @route GET /api/v1/collections/me
 */
export const listMyCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const collections = await communityService.listUserCollections(userId);

    sendSuccess(res, collections, 'Collections retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Add a skill to collection
 * @route POST /api/v1/collections/:id/skills
 */
export const addSkillToCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collectionId = req.params.id as string;
    const { skillId } = addSkillToCollectionSchema.parse(req.body);
    const userId = req.user!.id;

    const item = await communityService.addSkillToCollection(userId, collectionId, skillId);

    sendSuccess(res, item, 'Skill added to collection successfully', 201);
  } catch (error) {
    next(error);
  }
};
