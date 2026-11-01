import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as learningRoadmapService from '../services/learningRoadmapService.js';

export const generateLearningRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await learningRoadmapService.generateLearningRoadmap(
    req.user._id,
    req.body.careerId
  );
  return ApiResponse.success(
    res,
    roadmap,
    'Personalized learning roadmap generated successfully',
    HTTP_STATUS.CREATED
  );
});

export const getLatestLearningRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await learningRoadmapService.getLatestLearningRoadmap(
    req.user._id,
    req.params.careerId
  );
  return ApiResponse.success(res, roadmap, 'Learning roadmap retrieved successfully');
});

export const updateRoadmapPhase = asyncHandler(async (req, res) => {
  const roadmap = await learningRoadmapService.updateRoadmapPhase(
    req.user._id,
    req.params.roadmapId,
    req.params.phaseId,
    req.body.status
  );
  return ApiResponse.success(res, roadmap, 'Roadmap phase progress updated successfully');
});
