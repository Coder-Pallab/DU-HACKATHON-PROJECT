import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import * as careerController from '../controllers/careerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireDatabase } from '../middleware/requireDatabase.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { validateExtractSkills, validateClassifySkills } from '../validators/aiValidator.js';
import * as skillGapController from '../controllers/skillGapController.js';
import {
  validateSkillGapCareerId,
  validateSkillGapRequest,
} from '../validators/skillGapValidator.js';
import * as learningRoadmapController from '../controllers/learningRoadmapController.js';
import {
  validateRoadmapCareerId,
  validateRoadmapGeneration,
  validateRoadmapPhaseProgress,
  validateRoadmapActivityProgress,
} from '../validators/learningRoadmapValidator.js';
import * as careerCounsellorController from '../controllers/careerCounsellorController.js';
import {
  validateConversationId,
  validateConversationPagination,
  validateCounsellingMessage,
} from '../validators/careerCounsellorValidator.js';
import * as mockInterviewController from '../controllers/mockInterviewController.js';
import {
  validateMockInterviewAnswer,
  validateMockInterviewGeneration,
  validateMockInterviewId,
} from '../validators/mockInterviewValidator.js';

const router = Router();

// Protect all AI routes with authentication
router.use(authenticate);
router.use(requireDatabase);

/**
 * AI-Powered Skill Extraction & Classification (Rate-Limited)
 */
router.post('/skills/extract', aiLimiter, validateExtractSkills, aiController.extractSkills);
router.post('/skills/classify', aiLimiter, validateClassifySkills, aiController.classifySkills);

/**
 * AI-Powered Career Recommendations (Rate-Limited)
 */
router.post('/careers/recommend', aiLimiter, careerController.recommendCareersAI);

/**
 * Career-specific Skill Gap Analysis
 */
router.post(
  '/skill-gap/analyze',
  aiLimiter,
  validateSkillGapRequest,
  skillGapController.analyzeSkillGap
);
router.get(
  '/skill-gap/:careerId',
  validateSkillGapCareerId,
  skillGapController.getLatestSkillGapAnalysis
);

/**
 * Personalized learning roadmaps
 */
router.post(
  '/roadmaps/generate',
  aiLimiter,
  validateRoadmapGeneration,
  learningRoadmapController.generateLearningRoadmap
);
router.get('/roadmaps', learningRoadmapController.listLearningRoadmaps);
router.get(
  '/roadmaps/:careerId',
  validateRoadmapCareerId,
  learningRoadmapController.getLatestLearningRoadmap
);
router.patch(
  '/roadmaps/:roadmapId/phases/:phaseId',
  validateRoadmapPhaseProgress,
  learningRoadmapController.updateRoadmapPhase
);
router.patch(
  '/roadmaps/:roadmapId/phases/:phaseId/activities/:activityIndex',
  validateRoadmapActivityProgress,
  learningRoadmapController.updateRoadmapActivity
);

/**
 * Bilingual career counselling conversations
 */
router.post(
  '/chat/messages',
  aiLimiter,
  validateCounsellingMessage,
  careerCounsellorController.sendMessage
);
router.get(
  '/chat/conversations',
  validateConversationPagination,
  careerCounsellorController.listConversations
);
router.get(
  '/chat/conversations/:conversationId',
  validateConversationId,
  careerCounsellorController.getConversation
);

/**
 * AI mock interviews
 */
router.post(
  '/interviews',
  aiLimiter,
  validateMockInterviewGeneration,
  mockInterviewController.createMockInterview
);
router.get('/interviews', mockInterviewController.listMockInterviews);
router.get(
  '/interviews/:interviewId',
  validateMockInterviewId,
  mockInterviewController.getMockInterview
);
router.patch(
  '/interviews/:interviewId/questions/:questionId',
  aiLimiter,
  validateMockInterviewAnswer,
  mockInterviewController.submitMockInterviewAnswer
);
router.delete(
  '/interviews/:interviewId',
  validateMockInterviewId,
  mockInterviewController.deleteMockInterview
);

// Alias to retrieve current skills
router.get('/skills', aiController.getMySkills);

export default router;
