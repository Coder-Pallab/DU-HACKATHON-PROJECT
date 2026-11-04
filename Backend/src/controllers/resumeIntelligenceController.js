import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as resumeIntelligenceService from '../services/resumeIntelligenceService.js';

export const analyzeResume = asyncHandler(async (req, res) => {
  const analysis = await resumeIntelligenceService.analyzeResumeIntelligence(
    req.user,
    req.params.id,
    req.body.careerId
  );
  return ApiResponse.success(
    res,
    analysis,
    'Resume intelligence analysis completed',
    HTTP_STATUS.CREATED
  );
});

export const listAnalyses = asyncHandler(async (req, res) => {
  const analyses = await resumeIntelligenceService.listResumeAnalyses(req.user, req.params.id);
  return ApiResponse.success(res, analyses, 'Resume analyses retrieved successfully');
});

export const compareCompatibility = asyncHandler(async (req, res) => {
  const analysis = await resumeIntelligenceService.compareResumeToTarget(
    req.user,
    req.params.id,
    req.body
  );
  return ApiResponse.success(
    res,
    analysis,
    'Resume compatibility analysis completed',
    HTTP_STATUS.CREATED
  );
});

export const createImprovementDraft = asyncHandler(async (req, res) => {
  const draft = await resumeIntelligenceService.generateResumeImprovement(
    req.user,
    req.params.id,
    req.params.analysisId,
    req.body
  );
  return ApiResponse.success(
    res,
    draft,
    'Resume improvement draft generated',
    HTTP_STATUS.CREATED
  );
});

export const updateImprovementDraft = asyncHandler(async (req, res) => {
  const draft = await resumeIntelligenceService.updateResumeImprovementDraft(
    req.user,
    req.params.id,
    req.params.analysisId,
    req.params.draftId,
    req.body
  );
  return ApiResponse.success(res, draft, 'Resume improvement draft updated');
});
