import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../types/auth.types';
import { sendSuccess } from '../utils/apiResponse';

/**
 * Controller handling user registration
 * @route POST /api/v1/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = registerSchema.parse(req.body);
    const result = await authService.register(validatedInput);

    sendSuccess(res, result, 'User account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handling user login
 * @route POST /api/v1/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedInput = loginSchema.parse(req.body);
    const result = await authService.login(validatedInput);

    sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller retrieving profile of the currently authenticated user
 * @route GET /api/v1/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const profile = await authService.getCurrentUser(currentUserId);

    sendSuccess(res, profile, 'User profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

