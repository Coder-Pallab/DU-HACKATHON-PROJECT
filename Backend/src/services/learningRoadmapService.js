import LearningRoadmap from '../models/LearningRoadmap.js';
import SkillGapAnalysis from '../models/SkillGapAnalysis.js';
import { ApiError } from '../utils/apiError.js';
import { getCareerById } from './careerService.js';
import { getMyProfile } from './studentService.js';
import { analyzeSkillGap } from './skillGapService.js';
import { generateStructuredJSON } from './geminiService.js';

const PRIORITY_WEEKS = { High: 2, Medium: 1, Low: 1 };

export const buildRoadmapPhases = (analysis, career) => {
  const gaps = analysis.missingSkills || [];

  if (gaps.length > 0) {
    let week = 1;
    return gaps.map((gap, index) => {
      const duration = PRIORITY_WEEKS[gap.priority] || 1;
      const phase = {
        sequence: index + 1,
        title: `Build ${gap.name} skills`,
        focusSkill: gap.name,
        category: gap.category || 'Technical',
        priority: gap.priority || 'Low',
        weekStart: week,
        weekEnd: week + duration - 1,
        objective: `Develop practical ${gap.name} ability for ${career.title}.`,
        activities: (gap.learningSteps || [])
          .filter((step) => typeof step === 'string' && step.trim())
          .map((step) => step.trim().slice(0, 300))
          .slice(0, 5),
        status: 'not_started',
      };

      if (phase.activities.length === 0) {
        phase.activities = [
          `Study the core concepts of ${gap.name}.`,
          `Apply ${gap.name} in a practical project related to ${career.title}.`,
        ];
      }

      week += duration;
      return phase;
    });
  }

  const careerSteps = (career.suggestedNextSteps || [])
    .filter((step) => typeof step === 'string' && step.trim())
    .slice(0, 5);
  const activities =
    careerSteps.length > 0
      ? careerSteps
      : [`Build and document a portfolio project demonstrating your readiness for ${career.title}.`];

  return [
    {
      sequence: 1,
      title: `Prepare for ${career.title}`,
      focusSkill: 'Career readiness',
      category: 'Career',
      priority: 'Low',
      weekStart: 1,
      weekEnd: Math.max(1, activities.length),
      objective: `Apply your existing skills and prepare evidence of your readiness for ${career.title}.`,
      activities,
      status: 'not_started',
    },
  ];
};

const enrichRoadmap = async (student, career, phases) => {
  const prompt = `
Personalize this student's learning roadmap for the specified career.
Keep every phase focused on its supplied focusSkill; do not add or remove phases or invent external courses, credentials, or URLs.
Return JSON matching this schema:
{
  "summary": "string",
  "phases": [
    {
      "focusSkill": "exact supplied focus skill",
      "objective": "string",
      "activities": ["string"]
    }
  ]
}

Career: ${career.title}
Student degree: ${student.degree || 'Not specified'}
Student department: ${student.department || 'Not specified'}
Existing technical skills: ${JSON.stringify(
    (student.technicalSkills || [])
      .slice(0, 50)
      .map(({ name, proficiency }) => ({ name, proficiency }))
  )}
Existing soft skills: ${JSON.stringify((student.softSkills || []).slice(0, 30))}
Roadmap phases: ${JSON.stringify(
    phases.map(({ focusSkill, category, priority, weekStart, weekEnd, objective, activities }) => ({
      focusSkill,
      category,
      priority,
      weekStart,
      weekEnd,
      objective,
      activities,
    }))
  )}
`;

  const result = await generateStructuredJSON(
    prompt,
    'You are a practical career learning coach. Return valid JSON with concise, achievable advice.'
  );
  if (!result || typeof result !== 'object' || Array.isArray(result)) return null;

  const allowedSkills = new Set(phases.map((phase) => phase.focusSkill.toLowerCase()));
  const aiPhases = new Map();
  if (Array.isArray(result.phases)) {
    for (const phase of result.phases) {
      if (typeof phase?.focusSkill !== 'string') continue;
      const key = phase.focusSkill.trim().toLowerCase();
      if (!allowedSkills.has(key)) continue;

      const activities = Array.isArray(phase.activities)
        ? phase.activities
            .filter((activity) => typeof activity === 'string' && activity.trim())
            .map((activity) => activity.trim().slice(0, 300))
            .slice(0, 5)
        : [];
      const objective =
        typeof phase.objective === 'string' ? phase.objective.trim().slice(0, 500) : '';
      if (activities.length > 0 || objective) {
        aiPhases.set(key, { activities, objective });
      }
    }
  }

  const summary =
    typeof result.summary === 'string' && result.summary.trim()
      ? result.summary.trim().slice(0, 1000)
      : null;
  if (!summary && aiPhases.size === 0) return null;

  return { summary, phases: aiPhases };
};

const createRoadmapSummary = (career, phases) =>
  `A ${phases.length}-phase plan to build career readiness for ${career.title}, ordered by skill priority and estimated study weeks.`;

export const generateLearningRoadmap = async (userId, careerId) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);
  if (!career.isActive) {
    throw ApiError.notFound('Career is not available');
  }

  let analysis = await SkillGapAnalysis.findOne({
    student: student._id,
    user: userId,
    career: career._id,
  }).sort({ createdAt: -1 });

  if (!analysis) {
    analysis = await analyzeSkillGap(userId, careerId);
  }

  const phases = buildRoadmapPhases(analysis, career);
  const enrichment = await enrichRoadmap(student, career, phases);
  const enrichedPhases = phases.map((phase) => {
    const aiPhase = enrichment?.phases.get(phase.focusSkill.toLowerCase());
    if (!aiPhase) return phase;
    return {
      ...phase,
      objective: aiPhase.objective || phase.objective,
      activities: aiPhase.activities.length > 0 ? aiPhase.activities : phase.activities,
    };
  });

  return LearningRoadmap.create({
    student: student._id,
    user: userId,
    career: career._id,
    sourceAnalysis: analysis._id,
    careerTitle: career.title,
    summary: enrichment?.summary || createRoadmapSummary(career, phases),
    phases: enrichedPhases,
    isAIEnriched: Boolean(enrichment),
  });
};

export const getLatestLearningRoadmap = async (userId, careerId) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);
  if (!career.isActive) {
    throw ApiError.notFound('Career is not available');
  }

  const roadmap = await LearningRoadmap.findOne({
    user: userId,
    student: student._id,
    career: career._id,
  })
    .sort({ createdAt: -1 })
    .populate('career', 'title slug sector');

  if (!roadmap) {
    throw ApiError.notFound('No learning roadmap found for this career');
  }

  return roadmap;
};

export const updateRoadmapPhase = async (userId, roadmapId, phaseId, status) => {
  const roadmap = await LearningRoadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) {
    throw ApiError.notFound('Learning roadmap not found');
  }

  const phase = roadmap.phases.id(phaseId);
  if (!phase) {
    throw ApiError.notFound('Roadmap phase not found');
  }

  phase.status = status;
  phase.completedAt = status === 'completed' ? phase.completedAt || new Date() : null;
  const completedPhases = roadmap.phases.filter((item) => item.status === 'completed').length;
  roadmap.progressPercent = Math.round((completedPhases / roadmap.phases.length) * 100);
  roadmap.status =
    completedPhases === roadmap.phases.length
      ? 'completed'
      : roadmap.phases.some((item) => item.status === 'in_progress' || item.status === 'completed')
        ? 'in_progress'
        : 'not_started';

  await roadmap.save();
  return roadmap;
};
