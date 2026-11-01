import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { ENV } from './config/env.js';
import dns from 'dns'

let server;

dns.setServers(['1.1.1.1', '8.8.0.0']);

/**
 * Start the HTTP server after initializing database
 */
const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    server = app.listen(ENV.PORT, () => {
      console.log('====================================================');
      console.log(` AI Career Guidance Platform Backend is running!`);
      console.log(` Port:        http://localhost:${ENV.PORT}`);
      console.log(` Environment: ${ENV.NODE_ENV}`);
      console.log(` API Base:    http://localhost:${ENV.PORT}/api/v1`);
      console.log(` Health:      http://localhost:${ENV.PORT}/api/v1/health`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Graceful application shutdown
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed');
      await disconnectDB();
      console.log('[Server] Exiting process gracefully');
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }

  // Force close if it takes longer than 10 seconds
  setTimeout(() => {
    console.error('[Server] Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception] thrown:', error);
  process.exit(1);
});

// Launch server
startServer();

