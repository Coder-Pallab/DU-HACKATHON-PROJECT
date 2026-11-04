import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import aiRoutes from './aiRoutes.js';
import careerRoutes from './careerRoutes.js';

const apiRouter = Router();

// Root route of /api/v1
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the AI-Powered Career Guidance & Placement Assistance API (v1)',
    data: {
      health: '/api/v1/health',
      availableModules: [
        'Authentication & Authorization (/api/v1/auth)',
        'Student Profiles (/api/v1/students)',
        'Resume Management & Parsing (/api/v1/resumes)',
        'Resume Intelligence Centre (/api/v1/resumes/:id/intelligence)',
        'AI Skill Extraction & Classification (/api/v1/ai/skills)',
        'AI Career Recommendations (/api/v1/ai/careers)',
        'Skill Gap Analysis (/api/v1/ai/skill-gap)',
        'Personalised Roadmaps (/api/v1/ai/roadmaps)',
        'Placement Readiness (/api/v1/students/me/readiness)',
        'AI Mock Interviews (/api/v1/ai/interviews)',
        'Bilingual AI Career Counsellor (/api/v1/ai/chat)',
      ],
    },
  });
});

// Mount modular sub-routers
apiRouter.use('/', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/resumes', resumeRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/careers', careerRoutes);

export default apiRouter;
