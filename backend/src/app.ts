import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { apiV1Router } from './routes';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/apiResponse';

/**
 * Creates and configures the Express application pipeline.
 * Does NOT start listening on a network port (allows isolated testing).
 */
export const createApp = (): Application => {
  const app = express();

  // 1. Security HTTP Headers
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing (CORS)
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body Parsers with DoS Protection Limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Root Welcome Route
  app.get('/', (_req: Request, res: Response) => {
    sendSuccess(
      res,
      {
        service: 'AI-Powered Agent Skill Registry API',
        version: '1.0.0',
        documentation: '/api/v1/health',
      },
      'Welcome to the AI Skill Registry API'
    );
  });

  // 5. Versioned API Routes (/api/v1)
  app.use('/api/v1', apiV1Router);

  // 6. 404 Route Catch-All (must be registered after all valid routes)
  app.use(notFoundHandler);

  // 7. Centralized Error Handler (must be the final middleware)
  app.use(errorHandler);

  return app;
};

export const app = createApp();
