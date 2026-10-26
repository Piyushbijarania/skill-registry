import { Response } from 'express';

/**
 * Standard API Success Response Interface
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Standard API Error Response Interface
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Helper to send standardized success responses.
 *
 * @param res - Express Response object
 * @param data - Payload to send in data field
 * @param message - Optional human-readable message
 * @param statusCode - HTTP Status code (default 200)
 * @param meta - Optional pagination or metadata
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, unknown>
): Response => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Helper to send standardized error responses.
 *
 * @param res - Express Response object
 * @param statusCode - HTTP Status code
 * @param message - Human-readable error message
 * @param code - Machine-readable error code (e.g. "RESOURCE_NOT_FOUND")
 * @param details - Optional validation or error details
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  code: string,
  details?: unknown
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};
