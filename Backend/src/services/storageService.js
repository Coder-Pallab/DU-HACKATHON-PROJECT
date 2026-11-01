import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Upload resume file to Cloudinary if configured, or retain in local storage
 * @param {object} file - Multer file object
 * @returns {Promise<object>} Storage result metadata
 */
export const storeResumeFile = async (file) => {
  if (isCloudinaryConfigured) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'ai_career_guidance/resumes',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true,
      });

      // Cleanup local temporary file after successful cloud upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        fileUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        storageType: 'cloudinary',
        localFilePath: '',
      };
    } catch (cloudError) {
      console.warn(`[Cloudinary] Upload failed: ${cloudError.message}. Falling back to local storage.`);
    }
  }

  // Local storage fallback
  return {
    fileUrl: `/uploads/${file.filename}`,
    cloudinaryPublicId: '',
    storageType: 'local',
    localFilePath: file.path,
  };
};

/**
 * Remove resume file from Cloudinary or local disk
 * @param {object} resume - Resume document
 */
export const removeStoredFile = async (resume) => {
  if (resume.storageType === 'cloudinary' && resume.cloudinaryPublicId && isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(resume.cloudinaryPublicId, { resource_type: 'raw' });
    } catch (err) {
      console.error(`[Cloudinary] Failed to delete file ${resume.cloudinaryPublicId}:`, err.message);
    }
  }

  if (resume.localFilePath && fs.existsSync(resume.localFilePath)) {
    try {
      fs.unlinkSync(resume.localFilePath);
    } catch (err) {
      console.error(`[Storage] Failed to remove local file ${resume.localFilePath}:`, err.message);
    }
  }
};

