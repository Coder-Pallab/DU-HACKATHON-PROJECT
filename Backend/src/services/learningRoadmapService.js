import LearningRoadmap from '../models/LearningRoadmap.js';
import SkillGapAnalysis from '../models/SkillGapAnalysis.js';
import { ApiError } from '../utils/apiError.js';
import { getCareerById } from './careerService.js';
import { getMyProfile } from './studentService.js';
import { analyzeSkillGap } from './skillGapService.js';
import { generateStructuredJSON } from './geminiService.js';
import {
  containsAssameseText,
  getContentLanguage,
  getContentLanguageInstruction,
} from './aiContentLanguage.js';

const PRIORITY_WEEKS = { High: 2, Medium: 1, Low: 1 };

export const buildRoadmapPhases = (analysis, career, language = 'English') => {
  const gaps = analysis.missingSkills || [];

  if (gaps.length > 0) {
    let week = 1;
    return gaps.map((gap, index) => {
      const duration = PRIORITY_WEEKS[gap.priority] || 1;
      const isAssamese = language === 'Assamese';
      const phase = {
        sequence: index + 1,
        title: isAssamese ? `${gap.name} দক্ষতা বিকাশ কৰক` : `Build ${gap.name} skills`,
        focusSkill: gap.name,
        category: gap.category || 'Technical',
        priority: gap.priority || 'Low',
        weekStart: week,
        weekEnd: week + duration - 1,
        objective: isAssamese
          ? `${career.title}ৰ বাবে ${gap.name}ৰ ব্যৱহাৰিক দক্ষতা বিকাশ কৰক।`
          : `Develop practical ${gap.name} ability for ${career.title}.`,
        activities: (gap.learningSteps || [])
          .filter((step) => typeof step === 'string' && step.trim())
          .filter((step) => !isAssamese || containsAssameseText(step))
          .map((step) => step.trim().slice(0, 300))
          .slice(0, 5),
        status: 'not_started',
      };

      if (phase.activities.length === 0) {
        phase.activities = [
          ...(isAssamese
            ? [
                `${gap.name}ৰ মূল ধাৰণাসমূহ অধ্যয়ন কৰক।`,
                `${career.title}ৰ সৈতে জড়িত এটা ব্যৱহাৰিক প্ৰকল্পত ${gap.name} প্ৰয়োগ কৰক।`,
              ]
            : [
                `Study the core concepts of ${gap.name}.`,
                `Apply ${gap.name} in a practical project related to ${career.title}.`,
              ]),
        ];
      }

      week += duration;
      return phase;
    });
  }

  const isAssamese = language === 'Assamese';
  const careerSteps = (career.suggestedNextSteps || [])
    .filter((step) => typeof step === 'string' && step.trim())
    .filter((step) => !isAssamese || containsAssameseText(step))
    .slice(0, 5);
  const activities =
    careerSteps.length > 0
      ? careerSteps
      : [
          isAssamese
            ? `${career.title}ৰ বাবে আপোনাৰ দক্ষতা দেখুওৱা এটা portfolio প্ৰকল্প নিৰ্মাণ আৰু নথিভুক্ত কৰক।`
            : `Build and document a portfolio project demonstrating your readiness for ${career.title}.`,
        ];

  return [
    {
      sequence: 1,
      title: isAssamese ? `${career.title}ৰ বাবে প্ৰস্তুতি লওক` : `Prepare for ${career.title}`,
      focusSkill: 'Career readiness',
      category: 'Career',
      priority: 'Low',
      weekStart: 1,
      weekEnd: Math.max(1, activities.length),
      objective: isAssamese
        ? `আপোনাৰ বৰ্তমানৰ দক্ষতাসমূহ প্ৰয়োগ কৰক আৰু ${career.title}ৰ বাবে প্ৰস্তুতিৰ প্ৰমাণ সাজু কৰক।`
        : `Apply your existing skills and prepare evidence of your readiness for ${career.title}.`,
      activities,
      status: 'not_started',
    },
  ];
};

export const buildRoadmapPrompt = (student, career, phases, language) => `
Personalize this student's learning roadmap for the specified career.
Keep every phase focused on its supplied focusSkill; do not add or remove phases or invent external courses, credentials, or URLs.
${getContentLanguageInstruction(language)}
Return JSON matching this schema:
{
  "summary": "string",
  "careerDescription": "string",
  "phases": [
    {
      "focusSkill": "exact supplied focus skill",
      "objective": "string",
      "activities": ["string"]
    }
  ]
}

Career: ${career.title}
Career description: ${career.description}
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

const enrichRoadmap = async (student, career, phases, language) => {
  const result = await generateStructuredJSON(
    buildRoadmapPrompt(student, career, phases, language),
    `You are a practical career learning coach. Return valid JSON with concise, achievable advice. ${getContentLanguageInstruction(language)}`
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
            .filter((activity) => language !== 'Assamese' || containsAssameseText(activity))
            .map((activity) => activity.trim().slice(0, 300))
            .slice(0, 5)
        : [];
      const objective =
        typeof phase.objective === 'string' &&
        (language !== 'Assamese' || containsAssameseText(phase.objective))
          ? phase.objective.trim().slice(0, 500)
          : '';
      if (activities.length > 0 || objective) {
        aiPhases.set(key, { activities, objective });
      }
    }
  }

  const summary =
    typeof result.summary === 'string' &&
    result.summary.trim() &&
    (language !== 'Assamese' || containsAssameseText(result.summary))
      ? result.summary.trim().slice(0, 1000)
      : null;
  const careerDescription =
    typeof result.careerDescription === 'string' &&
    result.careerDescription.trim() &&
    (language !== 'Assamese' || containsAssameseText(result.careerDescription))
      ? result.careerDescription.trim().slice(0, 1000)
      : null;
  if (!summary && !careerDescription && aiPhases.size === 0) return null;

  return { summary, careerDescription, phases: aiPhases };
};

export const createRoadmapSummary = (career, phases, language = 'English') =>
  language === 'Assamese'
    ? `${phases.length}টা পৰ্যায়ৰ এই পৰিকল্পনাই দক্ষতাৰ অগ্ৰাধিকাৰ আৰু অধ্যয়নৰ আনুমানিক সপ্তাহ অনুসৰি ${career.title}ৰ বাবে আপোনাৰ প্ৰস্তুতি গঢ়ি তুলিব।`
    : `A ${phases.length}-phase plan to build career readiness for ${career.title}, ordered by skill priority and estimated study weeks.`;

export const preserveRoadmapProgress = (phases, previousRoadmap) => {
  const previousPhases = new Map(
    (previousRoadmap?.phases || []).map((phase) => [phase.focusSkill.toLowerCase(), phase])
  );
  const phasesWithProgress = phases.map((phase) => {
    const previousPhase = previousPhases.get(phase.focusSkill.toLowerCase());
    if (!previousPhase) return phase;
    return {
      ...phase,
      status: previousPhase.status,
      completedAt: previousPhase.completedAt,
    };
  });
  const completedPhases = phasesWithProgress.filter((phase) => phase.status === 'completed').length;
  const progressPercent = phasesWithProgress.length
    ? Math.round((completedPhases / phasesWithProgress.length) * 100)
    : 0;
  const status =
    phasesWithProgress.length > 0 && completedPhases === phasesWithProgress.length
      ? 'completed'
      : phasesWithProgress.some(
            (phase) => phase.status === 'in_progress' || phase.status === 'completed'
          )
        ? 'in_progress'
        : 'not_started';

  return { phases: phasesWithProgress, progressPercent, status };
};

export const generateLearningRoadmap = async (userId, careerId) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);
  if (!career.isActive) {
    throw ApiError.notFound('Career is not available');
  }
  const contentLanguage = getContentLanguage(student);

  let analysis = await SkillGapAnalysis.findOne({
    student: student._id,
    user: userId,
    career: career._id,
  }).sort({ createdAt: -1 });

  if (!analysis) {
    analysis = await analyzeSkillGap(userId, careerId);
  }

  const phases = buildRoadmapPhases(analysis, career, contentLanguage);
  const enrichment = await enrichRoadmap(student, career, phases, contentLanguage);
  const enrichedPhases = phases.map((phase) => {
    const aiPhase = enrichment?.phases.get(phase.focusSkill.toLowerCase());
    if (!aiPhase) return phase;
    return {
      ...phase,
      objective: aiPhase.objective || phase.objective,
      activities: aiPhase.activities.length > 0 ? aiPhase.activities : phase.activities,
    };
  });

  const previousRoadmap = await LearningRoadmap.findOne({
    student: student._id,
    user: userId,
    career: career._id,
  }).sort({ createdAt: -1 });
  const {
    phases: phasesWithProgress,
    progressPercent,
    status,
  } = preserveRoadmapProgress(enrichedPhases, previousRoadmap);

  return LearningRoadmap.create({
    student: student._id,
    user: userId,
    career: career._id,
    sourceAnalysis: analysis._id,
    careerTitle: career.title,
    contentLanguage,
    careerDescription:
      enrichment?.careerDescription ||
      (contentLanguage === 'Assamese'
        ? `এই কেৰিয়াৰত ${career.title}ৰ সৈতে জড়িত কামৰ বাবে প্ৰয়োজনীয় দক্ষতা আৰু অভিজ্ঞতা বিকাশত মনোযোগ দিয়া হয়।`
        : career.description),
    summary: enrichment?.summary || createRoadmapSummary(career, phases, contentLanguage),
    phases: phasesWithProgress,
    progressPercent,
    status,
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

export const getStudentLearningRoadmaps = async (userId) => {
  const student = await getMyProfile(userId);
  return LearningRoadmap.find({
    user: userId,
    student: student._id,
  })
    .sort({ updatedAt: -1 })
    .populate('career', 'title slug sector');
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
