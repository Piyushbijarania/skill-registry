import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Singleton PrismaClient Instance
 * Prevents multiple client connections during hot-reloading in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
