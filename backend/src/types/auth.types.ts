import { z } from 'zod';

/**
 * Authenticated User Representation attached to Express requests
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'DEVELOPER' | 'PUBLISHER' | 'ADMIN';
}

/**
 * JWT Token Payload Structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  displayName: string;
  role: 'DEVELOPER' | 'PUBLISHER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

/**
 * Express Request Type Augmentation
 * Extends Express.Request with optional typed user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Zod Validation Schema for User Registration (POST /auth/register)
 * Enforces email syntax, password minimum length, and safe role defaults.
 */
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password cannot exceed 128 characters' }),

  displayName: z
    .string({ required_error: 'Display name is required' })
    .min(2, { message: 'Display name must be at least 2 characters long' })
    .max(50, { message: 'Display name cannot exceed 50 characters' })
    .trim(),

  role: z
    .enum(['DEVELOPER', 'PUBLISHER'], {
      errorMap: () => ({ message: "Role must be either 'DEVELOPER' or 'PUBLISHER'" }),
    })
    .optional()
    .default('DEVELOPER'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Zod Validation Schema for User Login (POST /auth/login)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password cannot be empty' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

