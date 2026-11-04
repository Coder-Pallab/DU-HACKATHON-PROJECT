import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const developmentAccessSecret = 'dev_access_secret_ai_career_guidance_2026';
const developmentRefreshSecret = 'dev_refresh_secret_ai_career_guidance_2026';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Validated Environment Configuration
 */
export const ENV = Object.freeze({
  NODE_ENV: nodeEnv,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_career_guidance',
  
  // JWT
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || (nodeEnv === 'production' ? '' : developmentAccessSecret),
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || (nodeEnv === 'production' ? '' : developmentRefreshSecret),
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '1h',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // Google Gemini API
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-3.8-flash',
  GEMINI_COUNSELLOR_MODEL:
    process.env.GEMINI_COUNSELLOR_MODEL ||
    process.env.GEMINI_CHAT_MODEL ||
    'gemini-3.6-flash',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Upload limits
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
});

export const assertRuntimeConfig = (config = ENV) => {
  if (config.NODE_ENV !== 'production') return;

  if (
    typeof config.JWT_ACCESS_SECRET !== 'string' ||
    config.JWT_ACCESS_SECRET.length < 32 ||
    config.JWT_ACCESS_SECRET === developmentAccessSecret ||
    typeof config.JWT_REFRESH_SECRET !== 'string' ||
    config.JWT_REFRESH_SECRET.length < 32 ||
    config.JWT_REFRESH_SECRET === developmentRefreshSecret
  ) {
    throw new Error(
      'Production requires non-default JWT_ACCESS_SECRET and JWT_REFRESH_SECRET values of at least 32 characters.'
    );
  }

  if (config.JWT_ACCESS_SECRET === config.JWT_REFRESH_SECRET) {
    throw new Error('Production JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different.');
  }
};

export const isProduction = () => ENV.NODE_ENV === 'production';
export const isDevelopment = () => ENV.NODE_ENV === 'development';
