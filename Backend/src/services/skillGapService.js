import SkillGapAnalysis from '../models/SkillGapAnalysis.js';
import { ApiError } from '../utils/apiError.js';
import { calculateCareerMatch } from './careerRecommendationService.js';
import { getCareerById } from './careerService.js';
import { getMyProfile } from './studentService.js';
import { generateStructuredJSON } from './geminiService.js';
import {
  containsAssameseText,
  getContentLanguage,
  getContentLanguageInstruction,
} from './aiContentLanguage.js';

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

const getSkillPriority = (importance, weight) => {
  if (importance === 'Core' && weight >= 2) return 'High';
  if (importance === 'Core' || weight >= 1.5) return 'Medium';
  return 'Low';
};

const defaultLearningSteps = (skillName, careerTitle, language = 'English') =>
  language === 'Assamese'
    ? [
        `${careerTitle}ৰ কামত ব্যৱহৃত ${skillName}ৰ মূল ধাৰণাসমূহ অধ্যয়ন কৰক।`,
        `${skillName} ব্যৱহাৰ কৰি ব্যৱহাৰিক দক্ষতা দেখুওৱা এটা সৰু প্ৰকল্প নিৰ্মাণ কৰক।`,
        `প্ৰকল্পটো নথিভুক্ত কৰক আৰু portfolioত ${skillName} সম্পৰ্কীয় আপোনাৰ সিদ্ধান্তসমূহ ব্যাখ্যা কৰক।`,
      ]
    : [
        `Study the core concepts of ${skillName} used in ${careerTitle} roles.`,
        `Build a small project that demonstrates practical use of ${skillName}.`,
        `Document your project and explain your ${skillName} decisions in your portfolio.`,
      ];

export const buildSkillGapResult = (student, career, language = 'English') => {
  const careerMatch = calculateCareerMatch(student, career);
  const missingNames = new Set(
    careerMatch.missingSkills.map((name) => name.toLowerCase().trim())
  );
  const skillScores = [];
  if ((career.requiredTechnicalSkills || []).length > 0) {
    skillScores.push(careerMatch.scoreBreakdown.technicalScore);
  }
  if ((career.requiredSoftSkills || []).length > 0) {
    skillScores.push(careerMatch.scoreBreakdown.softSkillScore);
  }

  const missingSkills = (career.requiredTechnicalSkills || [])
    .filter((requiredSkill) => missingNames.has(requiredSkill.name.toLowerCase().trim()))
    .map((requiredSkill) => {
      const weight = requiredSkill.weight || (requiredSkill.importance === 'Core' ? 2 : 1);
      return {
        name: requiredSkill.name,
        category: 'Technical',
        importance: requiredSkill.importance || 'Core',
        weight,
        priority: getSkillPriority(requiredSkill.importance || 'Core', weight),
        learningSteps: defaultLearningSteps(requiredSkill.name, career.title, language),
      };
    });

  const studentSoftSkills = (student.softSkills || [])
    .map((skill) => skill.toLowerCase().trim())
    .filter(Boolean);
  const matchingSoftSkills = [];
  for (const requiredSkill of career.requiredSoftSkills || []) {
    const requiredName = requiredSkill.toLowerCase().trim();
    const matched = studentSoftSkills.some(
      (studentSkill) => studentSkill.includes(requiredName) || requiredName.includes(studentSkill)
    );
    if (matched) {
      matchingSoftSkills.push(requiredSkill);
    } else {
      missingSkills.push({
        name: requiredSkill,
        category: 'Soft Skill',
        importance: 'Preferred',
        weight: 1,
        priority: 'Low',
        learningSteps: defaultLearningSteps(requiredSkill, career.title, language),
      });
    }
  }

  missingSkills.sort(
    (left, right) =>
      PRIORITY_RANK[right.priority] - PRIORITY_RANK[left.priority] ||
      right.weight - left.weight ||
      left.name.localeCompare(right.name)
  );

  return {
    matchPercentage: skillScores.length
      ? Math.round(skillScores.reduce((total, score) => total + score, 0) / skillScores.length)
      : 100,
    matchingSkills: [...careerMatch.matchingSkills, ...matchingSoftSkills],
    missingSkills,
  };
};

export const createFallbackSummary = (careerTitle, matchingCount, missingCount, language = 'English') => {
  if (language === 'Assamese') {
    if (missingCount === 0) {
      return `আপুনি ${careerTitle}ৰ বাবে তালিকাভুক্ত সকলো কাৰিকৰী দক্ষতাৰ সৈতে বৰ্তমান মিল খায়। ব্যৱহাৰিক প্ৰকল্পৰ জৰিয়তে এই দক্ষতাসমূহ আৰু অধিক শক্তিশালী কৰি যাওক।`;
    }

    return `${careerTitle}ৰ বাবে আপুনি বৰ্তমান ${matchingCount}টা তালিকাভুক্ত দক্ষতাৰ সৈতে মিল খায়। তলত অগ্ৰাধিকাৰ অনুসৰি দেখুওৱা ${missingCount}টা দক্ষতাৰ ব্যৱধান পূৰণ কৰাত মনোযোগ দিয়ক।`;
  }

  if (missingCount === 0) {
    return `You currently match all listed technical skill requirements for ${careerTitle}. Continue strengthening these skills through practical projects.`;
  }

  return `You currently match ${matchingCount} listed skill${matchingCount === 1 ? '' : 's'} for ${careerTitle}. Focus first on the ${missingCount} prioritized skill gap${missingCount === 1 ? '' : 's'} below.`;
};

export const buildSkillGapPrompt = (student, career, gaps, language) => `
Create a practical skill-gap learning plan for this career.
Use only the supplied missing skills. Do not invent courses, certifications, or URLs.
${getContentLanguageInstruction(language)}
Return JSON matching this schema:
{
  "summary": "string",
  "skillPlans": [
    { "skillName": "exact supplied skill name", "learningSteps": ["string", "string", "string"] }
  ]
}

Career: ${career.title}
Career description: ${career.description}
Student degree: ${student.degree || 'Not specified'}
Student department: ${student.department || 'Not specified'}
Current technical skills: ${JSON.stringify(
    (student.technicalSkills || []).slice(0, 50).map((skill) => ({
      name: skill.name,
      proficiency: skill.proficiency,
    }))
  )}
Missing skills, ordered by priority: ${JSON.stringify(
    gaps.map(({ name, category, importance, weight, priority }) => ({
      name,
      category,
      importance,
      weight,
      priority,
    }))
  )}
`;

const enrichSkillGaps = async (student, career, gaps, language) => {
  if (gaps.length === 0) return null;

  const result = await generateStructuredJSON(
    buildSkillGapPrompt(student, career, gaps, language),
    `You are a career-skills coach. Return concise, practical advice as valid JSON. ${getContentLanguageInstruction(language)}`
  );

  if (!result || typeof result !== 'object' || Array.isArray(result)) return null;

  const plans = new Map();
  const allowedSkillNames = new Set(gaps.map((gap) => gap.name.toLowerCase()));
  if (Array.isArray(result.skillPlans)) {
    for (const plan of result.skillPlans) {
      if (typeof plan?.skillName !== 'string' || !Array.isArray(plan.learningSteps)) continue;
      const skillName = plan.skillName.trim().toLowerCase();
      if (!allowedSkillNames.has(skillName)) continue;
      const steps = plan.learningSteps
        .filter((step) => typeof step === 'string' && step.trim())
        .map((step) => step.trim().slice(0, 300))
        .filter((step) => language !== 'Assamese' || containsAssameseText(step))
        .slice(0, 3);
      if (steps.length > 0) plans.set(skillName, steps);
    }
  }

  const summary =
    typeof result.summary === 'string' &&
    result.summary.trim() &&
    (language !== 'Assamese' || containsAssameseText(result.summary))
      ? result.summary.trim().slice(0, 1000)
      : null;
  if (!summary && plans.size === 0) return null;

  return {
    summary,
    plans,
  };
};

export const analyzeSkillGap = async (userId, careerId, { enrich = true } = {}) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);

  if (!career.isActive) {
    throw ApiError.notFound('Career is not available');
  }

  const contentLanguage = getContentLanguage(student);
  const result = buildSkillGapResult(student, career, contentLanguage);
  const aiEnrichment = enrich
    ? await enrichSkillGaps(student, career, result.missingSkills, contentLanguage)
    : null;

  if (aiEnrichment) {
    result.missingSkills = result.missingSkills.map((gap) => ({
      ...gap,
      learningSteps: aiEnrichment.plans.get(gap.name.toLowerCase()) ||
        (contentLanguage === 'Assamese'
          ? defaultLearningSteps(gap.name, career.title, contentLanguage)
          : gap.learningSteps),
    }));
  }

  const analysis = await SkillGapAnalysis.create({
    student: student._id,
    user: userId,
    career: career._id,
    careerTitle: career.title,
    contentLanguage,
    matchPercentage: result.matchPercentage,
    matchingSkills: result.matchingSkills,
    missingSkills: result.missingSkills,
    summary:
      aiEnrichment?.summary ||
      createFallbackSummary(
        career.title,
        result.matchingSkills.length,
        result.missingSkills.length,
        contentLanguage
      ),
    isAIEnriched: Boolean(aiEnrichment),
  });

  return analysis;
};

export const getLatestSkillGapAnalysis = async (userId, careerId) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);
  if (!career.isActive) {
    throw ApiError.notFound('Career is not available');
  }

  const analysis = await SkillGapAnalysis.findOne({
    student: student._id,
    user: userId,
    career: career._id,
  })
    .sort({ createdAt: -1 })
    .populate('career', 'title slug sector');

  if (!analysis) {
    throw ApiError.notFound('No skill gap analysis found for this career');
  }

  return analysis;
};
