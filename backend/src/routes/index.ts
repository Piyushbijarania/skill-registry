import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { skillRoutes } from './skill.routes';
import { discoveryRoutes } from './discovery.routes';
import { compositionRoutes } from './composition.routes';
import { communityRoutes } from './community.routes';

const apiV1Router = Router();

// Mount feature domain routes
apiV1Router.use('/health', healthRoutes);
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/skills', skillRoutes);
apiV1Router.use('/discovery', discoveryRoutes);
apiV1Router.use('/composition', compositionRoutes);
apiV1Router.use('/community', communityRoutes);

export { apiV1Router };
