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
const TRUSTED_LEARNING_RESOURCES = [
  {
    key: 'javascript-mdn',
    matches: ['javascript'],
    title: 'JavaScript Guide',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    descriptions: {
      English: 'Use MDN’s reference guide to learn JavaScript concepts and language features.',
      Assamese: 'JavaScript ৰ ধাৰণা আৰু ভাষাৰ বৈশিষ্ট্য শিকিবলৈ MDN ৰ এই নিৰ্দেশিকা ব্যৱহাৰ কৰক।',
    },
  },
  {
    key: 'react-learn',
    matches: ['react'],
    title: 'Learn React',
    provider: 'React',
    url: 'https://react.dev/learn',
    descriptions: {
      English: 'Follow the official React tutorial to build components and interactive interfaces.',
      Assamese: 'Component আৰু interactive interface নিৰ্মাণ কৰিবলৈ React ৰ এই official tutorial অনুসৰণ কৰক।',
    },
  },
  {
    key: 'python-tutorial',
    matches: ['python'],
    title: 'The Python Tutorial',
    provider: 'Python.org',
    url: 'https://docs.python.org/3/tutorial/',
    descriptions: {
      English: 'Study Python syntax and core programming concepts in the official tutorial.',
      Assamese: 'Python ৰ syntax আৰু মূল programming ধাৰণাসমূহ official tutorial ত অধ্যয়ন কৰক।',
    },
  },
  {
    key: 'nodejs-learn',
    matches: ['node.js', 'nodejs'],
    title: 'Learn Node.js',
    provider: 'Node.js',
    url: 'https://nodejs.org/en/learn',
    descriptions: {
      English: 'Explore official Node.js learning material for server-side JavaScript.',
      Assamese: 'Server-side JavaScript শিকিবলৈ Node.js ৰ official শিক্ষণ সামগ্ৰী চাওক।',
    },
  },
  {
    key: 'mongodb-docs',
    matches: ['mongodb'],
    title: 'MongoDB Manual',
    provider: 'MongoDB',
    url: 'https://www.mongodb.com/docs/manual/',
    descriptions: {
      English: 'Use the MongoDB manual to learn document databases, queries, and data modeling.',
      Assamese: 'Document database, query আৰু data modeling শিকিবলৈ MongoDB manual ব্যৱহাৰ কৰক।',
    },
  },
  {
    key: 'sql-tutorial',
    matches: ['sql'],
    title: 'PostgreSQL Tutorial',
    provider: 'PostgreSQL',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    descriptions: {
      English: 'Practice relational database and SQL fundamentals with the PostgreSQL tutorial.',
      Assamese: 'PostgreSQL tutorial ৰ সহায়ত relational database আৰু SQL ৰ মূল কথা অনুশীলন কৰক।',
    },
  },
  {
    key: 'git-book',
    matches: ['git'],
    title: 'Pro Git Book',
    provider: 'Git SCM',
    url: 'https://git-scm.com/book/en/v2',
    descriptions: {
      English: 'Learn version-control workflows from the official Pro Git book.',
      Assamese: 'Official Pro Git কিতাপৰ পৰা version-control workflow শিকক।',
    },
  },
  {
    key: 'html-mdn',
    matches: ['html'],
    title: 'HTML Learning Area',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
    descriptions: {
      English: 'Build a foundation in semantic HTML with MDN’s learning material.',
      Assamese: 'MDN ৰ শিক্ষণ সামগ্ৰীৰে semantic HTML ৰ ভেটি গঢ়ি তোলক।',
    },
  },
  {
    key: 'css-mdn',
    matches: ['css'],
    title: 'CSS Learning Area',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
    descriptions: {
      English: 'Learn CSS layout, styling, and responsive design through MDN.',
      Assamese: 'MDN ৰ জৰিয়তে CSS layout, styling আৰু responsive design শিকক।',
    },
  },
  {
    key: 'excel-support',
    matches: ['excel'],
    title: 'Excel Help & Learning',
    provider: 'Microsoft Support',
    url: 'https://support.microsoft.com/en-us/excel',
    descriptions: {
      English: 'Practice spreadsheet formulas, tables, and analysis with Microsoft’s Excel guides.',
      Assamese: 'Microsoft ৰ Excel নিৰ্দেশিকাৰে spreadsheet formula, table আৰু analysis অনুশীলন কৰক।',
    },
  },
  {
    key: 'pandas-tutorial',
    matches: ['pandas', 'data analysis'],
    title: 'Pandas Getting Started Tutorials',
    provider: 'pandas',
    url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/',
    descriptions: {
      English: 'Work through official pandas tutorials for common data-analysis tasks.',
      Assamese: 'সাধাৰণ data-analysis কামৰ বাবে pandas ৰ official tutorialসমূহ অনুশীলন কৰক।',
    },
  },
];

export const getCuratedResources = (focusSkill, language = 'English') => {
  const skill = focusSkill.trim().toLowerCase();
  return TRUSTED_LEARNING_RESOURCES.filter((resource) =>
    resource.matches.some((match) => skill.includes(match) || match.includes(skill))
  )
    .slice(0, 2)
    .map(({ key, title, provider, url, descriptions }) => ({
      key,
      title,
      provider,
      url,
      description: descriptions[language] || descriptions.English,
    }));
};

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
      "activities": ["string"],
      "resources": [{ "key": "one of the supplied resourceOptions keys", "description": "string" }]
    }
  ]
}
For resources, choose only supplied resourceOptions and return only their key and a localized description. Never invent resource titles, providers, or URLs.

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
      resourceOptions: getCuratedResources(focusSkill, language).map(
        ({ key, title, provider, url }) => ({ key, title, provider, url })
      ),
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
      const allowedResources = new Map(
        getCuratedResources(phase.focusSkill, language).map((resource) => [resource.key, resource])
      );
      const resources = Array.isArray(phase.resources)
        ? phase.resources
            .filter(
              (resource) =>
                resource &&
                typeof resource.key === 'string' &&
                typeof resource.description === 'string' &&
                resource.description.trim() &&
                (language !== 'Assamese' || containsAssameseText(resource.description)) &&
                allowedResources.has(resource.key)
            )
            .map(({ key, description }) => ({
              ...allowedResources.get(key),
              description: description.trim().slice(0, 400),
            }))
        : [];
      const objective =
        typeof phase.objective === 'string' &&
        (language !== 'Assamese' || containsAssameseText(phase.objective))
          ? phase.objective.trim().slice(0, 500)
          : '';
      if (activities.length > 0 || objective || resources.length > 0) {
        aiPhases.set(key, { activities, objective, resources });
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
    const previousActivityProgress = new Map(
    (previousPhase?.activityProgress || []).map((activity) => [
      `${activity.activityIndex}:${activity.activity}`,
      activity,
    ])
    );
    const activityProgress = (phase.activities || []).map((activity, index) => {
    const previousActivity = previousActivityProgress.get(`${index}:${activity}`);
    if (previousActivity) return previousActivity;
    if (previousPhase?.status === 'completed') {
      return {
        activityIndex: index,
        activity,
        status: 'completed',
        completedAt: previousPhase.completedAt || new Date(),
      };
    }
    if (previousPhase?.status === 'in_progress' && index === 0) {
      return { activityIndex: index, activity, status: 'in_progress', completedAt: null };
    }
    return { activityIndex: index, activity, status: 'not_started', completedAt: null };
    });
    if (!previousPhase) return { ...phase, activityProgress };
    return {
      ...phase,
      status: previousPhase.status,
      completedAt: previousPhase.completedAt,
      activityProgress,
    };
  });
  const allActivities = phasesWithProgress.flatMap((phase) => phase.activityProgress);
  const completedActivities = allActivities.filter((activity) => activity.status === 'completed').length;
  const completedPhases = phasesWithProgress.filter((phase) => phase.status === 'completed').length;
  const progressPercent = allActivities.length
    ? Math.round((completedActivities / allActivities.length) * 100)
    : phasesWithProgress.length
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
    analysis = await analyzeSkillGap(userId, careerId, { enrich: false });
  }

  const phases = buildRoadmapPhases(analysis, career, contentLanguage);
  const enrichment = await enrichRoadmap(student, career, phases, contentLanguage);
  const enrichedPhases = phases.map((phase) => {
    const aiPhase = enrichment?.phases.get(phase.focusSkill.toLowerCase());
    const resources = getCuratedResources(phase.focusSkill, contentLanguage);
    if (!aiPhase) return { ...phase, resources };
    return {
      ...phase,
      objective: aiPhase.objective || phase.objective,
      activities: aiPhase.activities.length > 0 ? aiPhase.activities : phase.activities,
      resources: aiPhase.resources.length > 0 ? aiPhase.resources : resources,
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

  return addRoadmapSupplementalData(roadmap);
};

export const getStudentLearningRoadmaps = async (userId) => {
  const student = await getMyProfile(userId);
  const roadmaps = await LearningRoadmap.find({
    user: userId,
    student: student._id,
  })
    .sort({ updatedAt: -1 })
    .populate('career', 'title slug sector');
  return roadmaps.map(addRoadmapSupplementalData);
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
  phase.activityProgress = phase.activities.map((activity, index) => {
    const previous = phase.activityProgress.find(
      (item) => item.activityIndex === index
    );
    const taskStatus =
      status === 'completed'
        ? 'completed'
        : status === 'not_started'
          ? 'not_started'
          : previous?.status === 'completed'
            ? 'completed'
            : index === 0 &&
                !phase.activityProgress.some((item) => item.status !== 'not_started')
              ? 'in_progress'
              : previous?.status || 'not_started';
    return {
      activityIndex: index,
      activity,
      status: taskStatus,
      completedAt: taskStatus === 'completed' ? previous?.completedAt || new Date() : null,
    };
  });
  roadmap.progressPercent = calculateRoadmapProgress(roadmap.phases);
  roadmap.status =
    roadmap.phases.length > 0 && roadmap.phases.every((item) => item.status === 'completed')
      ? 'completed'
      : roadmap.phases.some((item) => item.status === 'in_progress' || item.status === 'completed')
        ? 'in_progress'
        : 'not_started';

  await roadmap.save();
  return roadmap;
};

export const calculateRoadmapProgress = (phases) => {
  const activityProgress = phases.flatMap((phase) =>
    phase.activities.map((activity, activityIndex) => {
      const progress = (phase.activityProgress || []).find(
        (item) => item.activityIndex === activityIndex && item.activity === activity
      );
      return progress?.status || (phase.status === 'completed' ? 'completed' : 'not_started');
    })
  );
  if (activityProgress.length === 0) return 0;
  return Math.round(
    (activityProgress.filter((status) => status === 'completed').length / activityProgress.length) *
      100
  );
};

const addRoadmapSupplementalData = (roadmap) => {
  const language = roadmap.contentLanguage || 'English';
  for (const phase of roadmap.phases) {
    if (!phase.activityProgress?.length) {
      phase.activityProgress = phase.activities.map((activity, activityIndex) => ({
        activityIndex,
        activity,
        status: phase.status === 'completed' ? 'completed' : 'not_started',
        completedAt: phase.status === 'completed' ? phase.completedAt : null,
      }));
    }
    if (!phase.resources?.length) {
      phase.resources = getCuratedResources(phase.focusSkill, language);
    }
  }
  return roadmap;
};

export const updateRoadmapActivity = async (
  userId,
  roadmapId,
  phaseId,
  activityIndex,
  status
) => {
  const roadmap = await LearningRoadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) throw ApiError.notFound('Learning roadmap not found');
  const phase = roadmap.phases.id(phaseId);
  if (!phase) throw ApiError.notFound('Roadmap phase not found');
  if (!Number.isInteger(activityIndex) || activityIndex < 0 || activityIndex >= phase.activities.length) {
    throw ApiError.notFound('Roadmap activity not found');
  }

  const activity = phase.activities[activityIndex];
  const progress = (phase.activityProgress || []).find(
    (item) => item.activityIndex === activityIndex
  );
  if (progress) {
    progress.status = status;
    progress.completedAt = status === 'completed' ? progress.completedAt || new Date() : null;
  } else {
    phase.activityProgress.push({
      activityIndex,
      activity,
      status,
      completedAt: status === 'completed' ? new Date() : null,
    });
  }

  const activityStatuses = phase.activities.map((item, index) => {
    const itemProgress = phase.activityProgress.find((entry) => entry.activityIndex === index);
    return itemProgress?.status || 'not_started';
  });
  phase.status = activityStatuses.every((itemStatus) => itemStatus === 'completed')
    ? 'completed'
    : activityStatuses.some((itemStatus) => itemStatus !== 'not_started')
      ? 'in_progress'
      : 'not_started';
  phase.completedAt =
    phase.status === 'completed' ? phase.completedAt || new Date() : null;
  roadmap.progressPercent = calculateRoadmapProgress(roadmap.phases);
  roadmap.status =
    roadmap.progressPercent === 100
      ? 'completed'
      : roadmap.phases.some((item) => item.status !== 'not_started')
        ? 'in_progress'
        : 'not_started';

  await roadmap.save();
  return roadmap;
};
