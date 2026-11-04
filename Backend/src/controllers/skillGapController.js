import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as skillGapService from '../services/skillGapService.js';

export const analyzeSkillGap = asyncHandler(async (req, res) => {
  const analysis = await skillGapService.analyzeSkillGap(req.user._id, req.body.careerId);
  return ApiResponse.success(
    res,
    analysis,
    'Skill gap analysis completed successfully',
    HTTP_STATUS.CREATED
  );
});

export const getLatestSkillGapAnalysis = asyncHandler(async (req, res) => {
  const analysis = await skillGapService.getLatestSkillGapAnalysis(
    req.user._id,
    req.params.careerId
  );
  return ApiResponse.success(res, analysis, 'Skill gap analysis retrieved successfully');
});
