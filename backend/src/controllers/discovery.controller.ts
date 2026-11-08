import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { discoveryService } from '../services/discovery.service';
import { sendSuccess } from '../utils/apiResponse';

const discoveryRequestSchema = z.object({
  prompt: z
    .string({ required_error: 'Prompt is required' })
    .min(5, 'Prompt must be at least 5 characters long')
    .max(1000, 'Prompt cannot exceed 1000 characters')
    .trim(),
});

/**
 * Controller: AI-Powered Skill Discovery
 * @route POST /api/v1/discovery
 */
export const discoverSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = discoveryRequestSchema.parse(req.body);
    const result = await discoveryService.discover(prompt);

    sendSuccess(res, result, 'Skill discovery recommendations generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

