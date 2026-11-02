import { ApiResponse } from '../utils/apiResponse.js';
import { getDatabaseStatus } from '../config/db.js';
import { ENV } from '../config/env.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Health check controller
 */
export const getHealthStatus = (req, res) => {
  const dbStatus = getDatabaseStatus();

  const healthData = {
    status: dbStatus.isConnected ? 'healthy' : 'degraded',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      api: 'operational',
      database: dbStatus,
      aiProvider: ENV.GEMINI_API_KEY ? 'configured' : 'missing_api_key',
      storage: isCloudinaryConfigured ? 'cloudinary' : 'local_fallback',
    },
    version: '1.0.0',
    apiPrefix: '/api/v1',
  };

  if (!dbStatus.isConnected) {
    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      success: false,
      message: 'Database is unavailable.',
      data: healthData,
      errors: [],
    });
  }

  return ApiResponse.success(res, healthData, RESPONSE_MESSAGES.HEALTH_CHECK_OK);
};

/**
 * Basic ping check
 */
export const ping = (req, res) => {
  return ApiResponse.success(res, { ping: 'pong', timestamp: Date.now() }, 'Pong');
};
