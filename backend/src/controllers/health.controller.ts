import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { env } from '../config/env';

/**
 * Controller to handle health check requests.
 * Used by load balancers, Kubernetes probes, and monitoring tools.
 */
export const getHealthStatus = (_req: Request, res: Response): void => {
  const memory = process.memoryUsage();

  const healthData = {
    status: 'healthy',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: {
      rss: Math.round(memory.rss / (1024 * 1024)),
      heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
      heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
    },
  };

  sendSuccess(res, healthData, 'AI Skill Registry backend is healthy');
};
