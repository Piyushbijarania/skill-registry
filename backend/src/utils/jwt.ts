import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUser, JwtPayload } from '../types/auth.types';
import { UnauthorizedError } from './errors';

/**
 * Generates a signed JWT access token for an authenticated user.
 *
 * @param user - Authenticated user details
 * @returns Encoded JWT string
 */
export const signAccessToken = (user: AuthUser): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Cryptographically verifies an incoming JWT token string and extracts its claims.
 *
 * @param token - Bearer JWT token string
 * @returns Decoded JwtPayload
 * @throws UnauthorizedError if token is expired, missing, or signature is tampered
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Authentication token has expired. Please log in again.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid authentication token signature.');
    }
    throw new UnauthorizedError('Authentication failed.');
  }
};

