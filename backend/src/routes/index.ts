import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { skillRoutes } from './skill.routes';

const apiV1Router = Router();

// Mount feature domain routes
apiV1Router.use('/health', healthRoutes);
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/skills', skillRoutes);

export { apiV1Router };
