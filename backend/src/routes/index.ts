import { Router } from 'express';
import { healthRoutes } from './health.routes';

const apiV1Router = Router();

// Mount individual feature domain routes
apiV1Router.use('/health', healthRoutes);

export { apiV1Router };
