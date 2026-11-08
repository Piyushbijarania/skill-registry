import { Request, Response, NextFunction } from 'express';
import { compositionService } from '../services/composition.service';
import { composeSkillsSchema, generateSkillSchema } from '../types/composition.types';
import { sendSuccess } from '../utils/apiResponse';

/**
 * Controller: Compose multiple skills into a unified bundle
 * @route POST /api/v1/composition/compose
 */
export const composeSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = composeSkillsSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await compositionService.composeSkills(userId, validatedInput);

    sendSuccess(res, result, 'Skill composition created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Generate a custom skill from a natural language prompt
 * @route POST /api/v1/composition/generate
 */
export const generateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = generateSkillSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await compositionService.generateSkillFromPrompt(userId, validatedInput);

    sendSuccess(res, result, 'Custom skill generated successfully', 201);
  } catch (error) {
    next(error);
  }
};
