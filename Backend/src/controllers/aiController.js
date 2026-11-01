import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import * as aiSkillService from '../services/aiSkillService.js';

/**
 * Extract skills and resume sections using Gemini AI
 * POST /api/v1/ai/skills/extract
 */
export const extractSkills = asyncHandler(async (req, res) => {
  const result = await aiSkillService.extractSkills({
    text: req.body.text,
    resumeId: req.body.resumeId,
    user: req.user,
  });

  return ApiResponse.success(res, result, 'Skills and resume sections extracted successfully');
});

/**
 * Classify a list of skills into standardized categories
 * POST /api/v1/ai/skills/classify
 */
export const classifySkills = asyncHandler(async (req, res) => {
  const result = await aiSkillService.classifySkills(req.body.skills);
  return ApiResponse.success(res, result, 'Skills classified successfully');
});

/**
 * Get all skills for current student
 * GET /api/v1/students/me/skills
 */
export const getMySkills = asyncHandler(async (req, res) => {
  const skills = await aiSkillService.getStudentSkills(req.user._id);
  return ApiResponse.success(res, skills, 'Student skills retrieved successfully');
});

/**
 * Manually add a skill to student profile
 * POST /api/v1/students/me/skills
 */
export const addMySkill = asyncHandler(async (req, res) => {
  const newSkill = await aiSkillService.addStudentSkill(req.user._id, req.body);
  return ApiResponse.success(res, newSkill, 'Skill added to profile successfully', HTTP_STATUS.CREATED);
});

/**
 * Manually update a skill in student profile
 * PATCH /api/v1/students/me/skills/:skillId
 */
export const updateMySkill = asyncHandler(async (req, res) => {
  const updatedSkill = await aiSkillService.updateStudentSkill(req.user._id, req.params.skillId, req.body);
  return ApiResponse.success(res, updatedSkill, 'Skill updated successfully');
});

/**
 * Manually delete a skill from student profile
 * DELETE /api/v1/students/me/skills/:skillId
 */
export const deleteMySkill = asyncHandler(async (req, res) => {
  await aiSkillService.deleteStudentSkill(req.user._id, req.params.skillId);
  return ApiResponse.success(res, null, 'Skill removed from profile successfully');
});

