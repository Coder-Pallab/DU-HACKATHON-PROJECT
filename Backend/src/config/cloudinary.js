import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

let isCloudinaryConfigured = false;

if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
  isCloudinaryConfigured = true;
  console.log('[Cloudinary] Cloud storage configured successfully');
} else {
  console.log('[Cloudinary] Missing credentials. Operating in local storage mode fallback.');
}

export { cloudinary, isCloudinaryConfigured };

