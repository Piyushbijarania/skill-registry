import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError } from '../utils/errors';
import { env } from '../config/env';

/**
 * 404 Catch-All Middleware for undefined routes.
 * Must be registered after all actual routes.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError('Route', `${req.method} ${req.originalUrl}`));
};

/**
 * Centralized Error-Handling Middleware.
 * In Express, error-handling middleware MUST have an arity of 4: (err, req, res, next).
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  // 1. Operational AppErrors (expected, controlled domain errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
      timestamp,
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
    return;
  }

  // 2. Zod Schema Validation Errors (e.g., invalid request body / params)
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload validation failed',
        details: formattedDetails,
      },
      timestamp,
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
    return;
  }

  // 3. Malformed JSON Body (Express bodyParser SyntaxError)
  if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'The request body contains invalid JSON syntax',
      },
      timestamp,
    });
    return;
  }

  // 4. Programmer / Unknown Errors (unhandled exceptions, DB connection dropouts, etc.)
  // Log unexpected errors for monitoring (e.g. Sentry, Datadog, CloudWatch)
  console.error('💥 UNHANDLED ERROR:', err);

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err instanceof Error
      ? err.message
      : 'Unknown internal error';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
    timestamp,
    ...(env.NODE_ENV === 'development' && err instanceof Error
      ? { stack: err.stack }
      : {}),
  });
};
