import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  if (isConnected) {
    console.log('[MongoDB] Using existing database connection');
    return mongoose.connection;
  }

  try {
    const connectionOptions = {
      autoIndex: true, // Build indexes in dev, consider disabling in high-traffic production
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(ENV.MONGODB_URI, connectionOptions);

    isConnected = conn.connections[0].readyState === 1;
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Register connection listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Database disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Database reconnected');
      isConnected = true;
    });

    return conn.connection;
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    // In production we may want to exit, but in dev we let the server run so health checks report DB status
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

/**
 * Disconnect from MongoDB database (for graceful shutdown or tests)
 */
export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Database connection closed');
  }
};

/**
 * Check if MongoDB is currently connected
 */
export const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: states[state] || 'unknown',
    isConnected: state === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

