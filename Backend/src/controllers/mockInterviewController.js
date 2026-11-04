import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as mockInterviewService from '../services/mockInterviewService.js';

export const createMockInterview = asyncHandler(async (req, res) => {
  const interview = await mockInterviewService.createMockInterview(
    req.user._id,
    req.body.careerId
  );
  return ApiResponse.success(
    res,
    interview,
    'Mock interview created successfully',
    HTTP_STATUS.CREATED
  );
});

export const listMockInterviews = asyncHandler(async (req, res) => {
  const interviews = await mockInterviewService.listMockInterviews(req.user._id);
  return ApiResponse.success(res, interviews, 'Mock interviews retrieved successfully');
});

export const getMockInterview = asyncHandler(async (req, res) => {
  const interview = await mockInterviewService.getMockInterview(
    req.user._id,
    req.params.interviewId
  );
  return ApiResponse.success(res, interview, 'Mock interview retrieved successfully');
});

export const submitMockInterviewAnswer = asyncHandler(async (req, res) => {
  const interview = await mockInterviewService.submitMockInterviewAnswer(
    req.user._id,
    req.params.interviewId,
    req.params.questionId,
    req.body.answer
  );
  return ApiResponse.success(res, interview, 'Mock interview answer evaluated successfully');
});

export const deleteMockInterview = asyncHandler(async (req, res) => {
  await mockInterviewService.deleteMockInterview(req.user._id, req.params.interviewId);
  return ApiResponse.success(res, null, 'Mock interview deleted successfully');
});
