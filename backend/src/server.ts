import { createServer } from 'http';
import { app } from './app';
import { env } from './config/env';

/**
 * Server Lifecycle Management
 * Handles process signals (SIGTERM, SIGINT) and ensures graceful shutdown.
 */
const startServer = () => {
  const server = createServer(app);

  server.listen(env.PORT, env.HOST, () => {
    console.log('====================================================');
    console.log(`🚀 AI Skill Registry Backend running successfully`);
    console.log(`📍 Environment : ${env.NODE_ENV}`);
    console.log(`🌐 Local URL   : http://localhost:${env.PORT}`);
    console.log(`🩺 Health Check: http://localhost:${env.PORT}/api/v1/health`);
    console.log('====================================================');
  });

  // Graceful Shutdown Handler
  const handleShutdown = (signal: string) => {
    console.log(`\n🛑 [${signal}] received. Initiating graceful shutdown...`);

    // Stop accepting new incoming connections
    server.close((err) => {
      if (err) {
        console.error('❌ Error during server close:', err);
        process.exit(1);
      }
      console.log('✅ All active HTTP connections closed cleanly.');
      console.log('👋 Process terminated gracefully.');
      process.exit(0);
    });

    // Force exit if active connections take longer than 10s to close
    setTimeout(() => {
      console.error('⚠️ Forcefully terminating process after 10s timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  // Process termination signals
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  // Global error safety nets
  process.on('uncaughtException', (error) => {
    console.error('💥 FATAL UNCAUGHT EXCEPTION:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('💥 FATAL UNHANDLED REJECTION:', reason);
    process.exit(1);
  });
};

startServer();
