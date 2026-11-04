import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as careerCounsellorService from '../services/careerCounsellorService.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { isNewConversation, ...result } = await careerCounsellorService.sendCounsellingMessage(
    req.user._id,
    req.body
  );
  return ApiResponse.success(
    res,
    result,
    'Career counselling response generated successfully',
    isNewConversation ? HTTP_STATUS.CREATED : HTTP_STATUS.OK
  );
});

export const listConversations = asyncHandler(async (req, res) => {
  const result = await careerCounsellorService.listCounsellingConversations(
    req.user._id,
    req.query
  );
  return ApiResponse.paginated(
    res,
    result.items,
    result.pagination,
    'Career counselling conversations retrieved successfully'
  );
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await careerCounsellorService.getCounsellingConversation(
    req.user._id,
    req.params.conversationId
  );
  return ApiResponse.success(res, conversation, 'Career counselling conversation retrieved successfully');
});
