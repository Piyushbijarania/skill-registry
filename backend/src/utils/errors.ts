/**
 * Base Application Error class.
 * All operational (expected) errors should extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Captures current stack trace, omitting constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

/**
 * 400 Validation Error (specifically for schema/input validation failures)
 */
export class ValidationError extends AppError {
  constructor(message = 'Input validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * 401 Unauthorized (Missing or invalid authentication credentials)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required to access this resource') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden (Authenticated, but insufficient permissions/roles)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found (Requested resource does not exist)
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' was not found`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * 409 Conflict (e.g. duplicate slug, email already registered)
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict detected') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 429 Too Many Requests (Rate limit reached)
 */
export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 500 Internal Server Error (Unexpected failure)
 */
export class InternalServerError extends AppError {
  constructor(message = 'An unexpected internal error occurred') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}
