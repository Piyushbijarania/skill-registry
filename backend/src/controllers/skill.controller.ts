import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';
import { securityService } from '../services/security.service';
import {
  createSkillSchema,
  publishVersionSchema,
  listSkillsQuerySchema,
} from '../types/skill.types';
import { sendSuccess } from '../utils/apiResponse';

/**
 * Controller: List skills with search and pagination
 * @route GET /api/v1/skills
 */
export const listSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedQuery = listSkillsQuerySchema.parse(req.query);
    const result = await skillService.listSkills(validatedQuery);

    sendSuccess(
      res,
      result.skills,
      'Skills retrieved successfully',
      200,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get single skill details by slug
 * @route GET /api/v1/skills/:slug
 */
export const getSkillBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const skill = await skillService.getSkillBySlug(slug);

    sendSuccess(res, skill, 'Skill details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Create a new skill
 * @route POST /api/v1/skills
 */
export const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = createSkillSchema.parse(req.body);
    const publisherId = req.user!.id;

    const skill = await skillService.createSkill(publisherId, validatedInput);

    sendSuccess(res, skill, 'Skill created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Publish a new immutable version for a skill
 * @route POST /api/v1/skills/:slug/versions
 */
export const publishVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const validatedInput = publishVersionSchema.parse(req.body);
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const version = await skillService.publishVersion(
      userId,
      userRole,
      slug,
      validatedInput
    );

    sendSuccess(res, version, 'Skill version published successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get security assessment report for a skill version
 * @route GET /api/v1/skills/:slug/versions/:version/security
 */
export const getSecurityReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const version = req.params.version as string;

    const report = await securityService.getAssessment(slug, version);

    sendSuccess(res, report, 'Security assessment report retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
