import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as careerService from '../services/careerService.js';
import * as recommendationService from '../services/careerRecommendationService.js';

/**
 * Get all available careers
 * GET /api/v1/careers
 */
export const getAllCareers = asyncHandler(async (req, res) => {
  const result = await careerService.getAllCareers(req.query);
  return ApiResponse.paginated(res, result.items, result.pagination, 'Careers retrieved successfully');
});

/**
 * Get career details by ID or slug
 * GET /api/v1/careers/:id
 */
export const getCareerById = asyncHandler(async (req, res) => {
  const career = await careerService.getCareerById(req.params.id);
  return ApiResponse.success(res, career, 'Career details retrieved successfully');
});

/**
 * Get career recommendations for logged-in student
 * GET /api/v1/students/me/recommendations
 */
export const getMyRecommendations = asyncHandler(async (req, res) => {
  const result = await recommendationService.getStudentRecommendations(req.user._id);
  return ApiResponse.success(res, result, 'Career recommendations retrieved successfully');
});

/**
 * Refresh and recompute career recommendations for student
 * POST /api/v1/students/me/recommendations/refresh
 */
export const refreshMyRecommendations = asyncHandler(async (req, res) => {
  const result = await recommendationService.generateCareerRecommendations(req.user._id);
  return ApiResponse.success(res, result, 'Career recommendations refreshed successfully');
});

/**
 * Trigger AI career recommendation endpoint
 * POST /api/v1/ai/careers/recommend
 */
export const recommendCareersAI = asyncHandler(async (req, res) => {
  const result = await recommendationService.generateCareerRecommendations(req.user._id);
  return ApiResponse.success(res, result, 'AI Career recommendations evaluated successfully');
});

