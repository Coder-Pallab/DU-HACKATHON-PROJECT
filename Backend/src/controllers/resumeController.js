import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as resumeService from '../services/resumeService.js';

/**
 * Upload resume file (PDF or DOCX)
 * POST /api/v1/resumes/upload
 */
export const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.uploadResume(req.user._id, req.file);
  return ApiResponse.success(res, resume, 'Resume uploaded successfully', HTTP_STATUS.CREATED);
});

/**
 * Get all resumes for current user (or all if admin)
 * GET /api/v1/resumes
 */
export const getResumes = asyncHandler(async (req, res) => {
  const result = await resumeService.getResumes(req.user._id, req.user.role, req.query);
  return ApiResponse.paginated(res, result.items, result.pagination, 'Resumes retrieved successfully');
});

/**
 * Get single resume by ID
 * GET /api/v1/resumes/:id
 */
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResumeById(req.params.id, req.user);
  return ApiResponse.success(res, resume, 'Resume retrieved successfully');
});

/**
 * Download resume file
 * GET /api/v1/resumes/:id/download
 */
export const downloadResume = asyncHandler(async (req, res) => {
  const downloadInfo = await resumeService.downloadResume(req.params.id, req.user);

  if (downloadInfo.mode === 'file') {
    return res.download(downloadInfo.path, downloadInfo.fileName);
  }

  // If stored in cloud storage, redirect directly
  return res.redirect(downloadInfo.url);
});

/**
 * Parse plain text from resume
 * POST /api/v1/resumes/:id/parse
 */
export const parseResume = asyncHandler(async (req, res) => {
  const result = await resumeService.parseResume(req.params.id, req.user);
  return ApiResponse.success(res, result, 'Resume text extracted successfully');
});

/**
 * Analyze resume sections (skills, experience, education)
 * POST /api/v1/resumes/:id/analyze
 */
export const analyzeResume = asyncHandler(async (req, res) => {
  const result = await resumeService.analyzeResume(req.params.id, req.user);
  return ApiResponse.success(res, result, 'Resume analyzed successfully');
});

/**
 * Delete resume and file
 * DELETE /api/v1/resumes/:id
 */
export const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.params.id, req.user);
  return ApiResponse.success(res, null, 'Resume deleted successfully');
});

