import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as studentService from '../services/studentService.js';
import * as placementReadinessService from '../services/placementReadinessService.js';

/**
 * Get profile of logged-in student
 * GET /api/v1/students/me
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.getMyProfile(req.user._id);
  return ApiResponse.success(res, profile, 'Student profile retrieved successfully');
});

/**
 * Get student profile by ID
 * GET /api/v1/students/:id
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const profile = await studentService.getStudentById(req.params.id, req.user);
  return ApiResponse.success(res, profile, 'Student profile details retrieved');
});

/**
 * Create student profile manually
 * POST /api/v1/students/profile
 */
export const createProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.createProfile(req.user._id, req.body);
  return ApiResponse.success(res, profile, 'Student profile created successfully', HTTP_STATUS.CREATED);
});

/**
 * Update general student profile
 * PATCH /api/v1/students/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.updateProfile(req.user._id, req.body);
  return ApiResponse.success(res, profile, 'Profile updated successfully');
});

/**
 * Update academic details
 * PATCH /api/v1/students/academic-details
 */
export const updateAcademicDetails = asyncHandler(async (req, res) => {
  const profile = await studentService.updateAcademicDetails(req.user._id, req.body);
  return ApiResponse.success(res, profile, 'Academic details updated successfully');
});

/**
 * Update skills and career interests
 * PATCH /api/v1/students/interests
 */
export const updateInterests = asyncHandler(async (req, res) => {
  const profile = await studentService.updateInterests(req.user._id, req.body);
  return ApiResponse.success(res, profile, 'Skills and career interests updated successfully');
});

/**
 * Update preferences (language, etc.)
 * PATCH /api/v1/students/preferences
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const profile = await studentService.updatePreferences(req.user._id, req.body);
  return ApiResponse.success(res, profile, 'Preferences updated successfully');
});

export const createPlacementReadinessAssessment = asyncHandler(async (req, res) => {
  const assessment = await placementReadinessService.createPlacementReadinessAssessment(
    req.user._id,
    req.body.careerId
  );
  return ApiResponse.success(
    res,
    assessment,
    'Placement readiness assessment created successfully',
    HTTP_STATUS.CREATED
  );
});

export const getLatestPlacementReadinessAssessment = asyncHandler(async (req, res) => {
  const assessment = await placementReadinessService.getLatestPlacementReadinessAssessment(
    req.user._id,
    req.params.careerId
  );
  return ApiResponse.success(
    res,
    assessment,
    assessment
      ? 'Placement readiness assessment retrieved successfully'
      : 'No placement readiness assessment exists for this career yet'
  );
});
