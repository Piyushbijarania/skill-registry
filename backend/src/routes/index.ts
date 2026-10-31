import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';

const apiV1Router = Router();

// Mount individual feature domain routes
apiV1Router.use('/health', healthRoutes);
apiV1Router.use('/auth', authRoutes);

export { apiV1Router };
