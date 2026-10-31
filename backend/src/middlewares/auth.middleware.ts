import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { AuthUser } from '../types/auth.types';

/**
 * Middleware to authenticate requests using a Bearer JWT in Authorization header.
 * Attaches decoded user to `req.user`.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token required (Format: Bearer <token>)');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Malformed authorization header');
  }

  const decoded = verifyAccessToken(token);

  const authUser: AuthUser = {
    id: decoded.userId,
    email: decoded.email,
    displayName: decoded.displayName,
    role: decoded.role,
  };

  req.user = authUser;
  next();
};

/**
 * Middleware factory for Role-Based Access Control (RBAC).
 *
 * @param allowedRoles - Roles permitted to access the route
 */
export const authorize = (...allowedRoles: Array<'DEVELOPER' | 'PUBLISHER' | 'ADMIN'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User authentication context missing');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Role '${req.user.role}' does not have permission to access this resource.`
      );
    }

    next();
  };
};

