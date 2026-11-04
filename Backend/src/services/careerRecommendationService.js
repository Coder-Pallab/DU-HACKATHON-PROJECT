import Career from '../models/Career.js';
import CareerRecommendation from '../models/CareerRecommendation.js';
import Student from '../models/Student.js';
import { ApiError } from '../utils/apiError.js';
import { seedDefaultCareers } from './careerService.js';
import { getMyProfile } from './studentService.js';
import { generateStructuredJSON } from './geminiService.js';
import {
  containsAssameseText,
  getContentLanguage,
  getContentLanguageInstruction,
} from './aiContentLanguage.js';

const ASSAMESE_CAREER_TITLES = {
  'Full Stack Developer': 'ফুল ষ্টেক ডেভেলপাৰ',
  'Frontend Developer': 'ফ্ৰণ্টএণ্ড ডেভেলপাৰ',
  'Backend Developer': 'বেকএণ্ড ডেভেলপাৰ',
  'Data Analyst': 'ডাটা বিশ্লেষক',
  'Data Scientist': 'ডাটা বিজ্ঞানী',
  'AI/ML Engineer': 'AI/ML অভিযন্তা',
  'Cloud Engineer': 'ক্লাউড অভিযন্তা',
  'Cybersecurity Analyst': 'চাইবাৰ সুৰক্ষা বিশ্লেষক',
  'UI/UX Designer': 'UI/UX ডিজাইনাৰ',
  'Financial Analyst': 'বিত্তীয় বিশ্লেষক',
  'Investment Banking Analyst': 'বিনিয়োগ বেংকিং বিশ্লেষক',
  Accountant: 'একাউণ্টেণ্ট',
  Teacher: 'শিক্ষক',
  'Tech Sales & Business Development Representative':
    'প্ৰযুক্তি বিক্ৰী আৰু ব্যৱসায় বিকাশ প্ৰতিনিধি',
  'Digital Marketing Specialist': 'ডিজিটেল মাৰ্কেটিং বিশেষজ্ঞ',
  'Business Analyst': 'ব্যৱসায় বিশ্লেষক',
  'Product Manager': 'প্ৰডাক্ট মেনেজাৰ',
};

const ASSAMESE_SECTORS = {
  Technology: 'প্ৰযুক্তি',
  'Finance & Banking': 'বিত্ত আৰু বেংকিং',
  'Education & Training': 'শিক্ষা আৰু প্ৰশিক্ষণ',
  'Sales & Marketing': 'বিক্ৰী আৰু মাৰ্কেটিং',
  'Business & Management': 'ব্যৱসায় আৰু ব্যৱস্থাপনা',
  'Design & Creative': 'ডিজাইন আৰু সৃষ্টিশীলতা',
};

export const getFallbackLocalizedContent = (recommendation, language) => {
  if (language !== 'Assamese') {
    return {
      localizedCareerTitle: recommendation.careerTitle,
      localizedSector: recommendation.sector,
      localizedCareerDescription: recommendation.careerDescription,
      localizedCareerFitSummary: recommendation.careerFitSummary,
      localizedRequiredQualifications: recommendation.requiredQualifications,
      localizedSuggestedNextSteps: recommendation.suggestedNextSteps,
    };
  }

  const careerTitle =
    ASSAMESE_CAREER_TITLES[recommendation.careerTitle] || recommendation.careerTitle;
  const missingSkills = recommendation.missingSkills.slice(0, 3);
  const skillList = missingSkills.length > 0 ? missingSkills.join(', ') : 'নতুন দক্ষতা';
  return {
    localizedCareerTitle: careerTitle,
    localizedSector: ASSAMESE_SECTORS[recommendation.sector] || 'কৰ্মক্ষেত্ৰ',
    localizedCareerDescription: `${careerTitle} হিচাপে এই কেৰিয়াৰত পেছাগত দায়িত্ব পালন আৰু প্ৰয়োজনীয় দক্ষতা বিকাশত মনোযোগ দিয়া হয়।`,
    localizedCareerFitSummary: `আপোনাৰ শিক্ষা, দক্ষতা আৰু আগ্ৰহৰ সৈতে এই কেৰিয়াৰৰ মিল আছে। ${skillList} শিকিলে এই ক্ষেত্ৰৰ বাবে আপোনাৰ প্ৰস্তুতি অধিক শক্তিশালী হ'ব।`,
    localizedRequiredQualifications: [
      'এই কেৰিয়াৰৰ অৰ্হতা আৰু প্ৰমাণপত্ৰ নিয়োগকৰ্তা অনুসৰি ভিন্ন হ’ব পাৰে।',
    ],
    localizedSuggestedNextSteps: [
      `${skillList} শিকিবলৈ এটা ব্যৱহাৰিক অধ্যয়ন পৰিকল্পনা তৈয়াৰ কৰক।`,
      `এই ক্ষেত্ৰৰ বাস্তৱ কামৰ সৈতে মিল থকা এটা প্ৰকল্প সম্পূৰ্ণ কৰক।`,
      'আপোনাৰ প্ৰকল্প আৰু দক্ষতাসমূহেৰে এটা পেছাগত portfolio তৈয়াৰ কৰক।',
    ],
  };
};

export const hasValidLocalizedContent = (item, language) => {
  const requiredText = [
    item.localizedCareerTitle,
    item.localizedSector,
    item.localizedCareerDescription,
    item.localizedCareerFitSummary,
  ];
  const requiredLists = [
    item.localizedRequiredQualifications,
    item.localizedSuggestedNextSteps,
  ];

  if (
    requiredText.some((value) => typeof value !== 'string' || value.trim().length === 0) ||
    requiredLists.some(
      (value) =>
        !Array.isArray(value) ||
        value.length === 0 ||
        value.some((entry) => typeof entry !== 'string' || !entry.trim())
    )
  ) {
    return false;
  }

  if (language === 'Assamese') {
    return [...requiredText, ...requiredLists.flat()].every(containsAssameseText);
  }
  return true;
};

const INTEREST_GROUPS = [
  {
    sector: 'Education & Training',
    keywords: ['teacher', 'teaching', 'educator', 'education', 'tutor', 'tutoring', 'lecturer', 'professor'],
  },
  {
    sector: 'Finance & Banking',
    keywords: ['accountant', 'accounting', 'accounts', 'bookkeeper', 'bookkeeping', 'auditor', 'audit', 'finance', 'banking'],
  },
];

export const getInterestScore = (interests, career) => {
  const careerTitle = career.title.toLowerCase();
  const careerSector = (career.sector || '').toLowerCase();
  let score = 35;

  for (const rawInterest of interests) {
    const interest = rawInterest.trim().toLowerCase();
    if (interest.length < 3) continue;

    if (
      interest === careerTitle ||
      careerTitle.includes(interest) ||
      interest.includes(careerTitle)
    ) {
      return 100;
    }

    const matchingGroup = INTEREST_GROUPS.find(({ keywords }) =>
      keywords.some((keyword) => interest.includes(keyword) || keyword.includes(interest))
    );
    if (matchingGroup && careerSector === matchingGroup.sector.toLowerCase()) {
      score = Math.max(score, 90);
    }

    if (careerSector.includes(interest) || interest.includes(careerSector)) {
      score = Math.max(score, 90);
    }

    const careerWords = careerTitle.split(' ');
    const interestWords = interest.split(' ');
    if (careerWords.some((word) => word.length > 2 && interestWords.includes(word))) {
      score = Math.max(score, 75);
    }
  }

  return score;
};

/**
 * Fuzzy check if a student skill matches a required career skill
 * @param {string} studentSkillName 
 * @param {string} requiredSkillName 
 * @returns {boolean}
 */
const isSkillMatch = (studentSkillName, requiredSkillName) => {
  const s = studentSkillName.toLowerCase().trim();
  const r = requiredSkillName.toLowerCase().trim();

  if (s === r) return true;

  // Exact token or alias matching
  const aliases = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    reactjs: 'react',
    'react.js': 'react',
    nodejs: 'node.js',
    postgres: 'postgresql',
    mongo: 'mongodb',
    ml: 'machine learning',
    dl: 'deep learning',
    aws: 'amazon web services',
    'rest api': 'rest apis',
    'restful api': 'rest apis',
    'restful apis': 'rest apis',
    fe: 'frontend',
    be: 'backend',
    crm: 'crm (salesforce/hubspot)',
    salesforce: 'crm (salesforce/hubspot)',
    hubspot: 'crm (salesforce/hubspot)',
    seo: 'seo',
    ga4: 'google analytics (ga4)',
    'google analytics': 'google analytics (ga4)',
    ppc: 'performance marketing (ppc)',
    'financial modelling': 'financial modeling',
    dcf: 'dcf modeling',
    valuation: 'company valuation',
    'm&a': 'mergers & acquisitions',
  };

  const normS = aliases[s] || s;
  const normR = aliases[r] || r;

  return normS === normR || normS.includes(normR) || normR.includes(normS);
};

/**
 * Sector-aware academic qualification evaluator
 * Ensures students in Commerce, Arts, or Business are scored fairly in non-tech roles
 * @param {object} student 
 * @param {string} sector 
 * @returns {number} Education score (0 to 100)
 */
const evaluateEducationForSector = (student, sector = 'Technology') => {
  const degree = (student.degree || '').toLowerCase();
  const dept = (student.department || '').toLowerCase();

  let baseScore = 65;

  if (sector === 'Finance & Banking') {
    const isFinanceEdu = ['b.com', 'bcom', 'bba', 'economics', 'finance', 'accounting', 'mba', 'm.com'].some(
      (d) => degree.includes(d) || dept.includes(d)
    );
    if (isFinanceEdu) baseScore = 90;
    else if (degree.includes('b.tech') || dept.includes('math') || dept.includes('stat')) baseScore = 80;
  } else if (sector === 'Sales & Marketing') {
    // Sales & Marketing values diverse backgrounds with high interpersonal aptitude
    const isBusinessOrComm = ['bba', 'b.com', 'marketing', 'mass comm', 'journalism', 'mba', 'b.a', 'arts'].some(
      (d) => degree.includes(d) || dept.includes(d)
    );
    if (isBusinessOrComm) baseScore = 90;
    else baseScore = 85; // Any degree is highly acceptable in tech sales
  } else if (sector === 'Business & Management') {
    const isMgmtEdu = ['bba', 'mba', 'b.com', 'management', 'economics', 'b.tech'].some(
      (d) => degree.includes(d) || dept.includes(d)
    );
    if (isMgmtEdu) baseScore = 90;
    else baseScore = 75;
  } else if (sector === 'Design & Creative') {
    const isDesignEdu = ['design', 'b.des', 'fine arts', 'multimedia', 'animation', 'bca'].some(
      (d) => degree.includes(d) || dept.includes(d)
    );
    if (isDesignEdu) baseScore = 90;
    else baseScore = 75;
  } else if (sector === 'Education & Training') {
    const isEducationEdu = ['education', 'teaching', 'pedagogy', 'b.ed', 'teacher training'].some(
      (field) => degree.includes(field) || dept.includes(field)
    );
    if (isEducationEdu) baseScore = 90;
    else if (degree || dept) baseScore = 80;
  } else {
    // Technology
    const isStemDegree = ['b.tech', 'btech', 'b.e', 'be', 'bca', 'mca', 'm.tech', 'b.sc', 'm.sc'].some((d) =>
      degree.includes(d)
    );
    const isCsRelated = ['computer', 'information', 'software', 'it', 'cse', 'ai', 'data'].some((c) =>
      dept.includes(c)
    );

    if (isStemDegree && isCsRelated) baseScore = 90;
    else if (isStemDegree || isCsRelated) baseScore = 75;
  }

  // Academic standing bonus for high CGPA
  if (student.cgpa && student.cgpa > 0) {
    const cgpaNormalized = Math.min(student.cgpa / 10, 1) * 10;
    baseScore = Math.min(100, baseScore + cgpaNormalized);
  }

  return baseScore;
};

/**
 * Deterministic scoring function for a student against a specific career
 * @param {object} student 
 * @param {object} career 
 * @returns {object} Evaluation breakdown and match percentage
 */
export const calculateCareerMatch = (student, career) => {
  const technicalSkills = student.technicalSkills || [];
  const softSkills = (student.softSkills || []).map((s) => s.toLowerCase().trim());
  const interests = (student.careerInterests || []).map((i) => i.toLowerCase().trim());

  // 1. Sector-Specific Technical Skills Scoring (Weight: 50%)
  const matchingSkills = [];
  const missingSkills = [];

  let earnedTechWeight = 0;
  let totalTechWeight = 0;

  const proficiencyMultipliers = {
    Expert: 1.05,
    Advanced: 1.0,
    Intermediate: 0.85,
    Beginner: 0.65,
  };

  const requiredTech = career.requiredTechnicalSkills || [];

  for (const reqSkill of requiredTech) {
    const weight = reqSkill.weight || (reqSkill.importance === 'Core' ? 2 : 1);
    totalTechWeight += weight;

    // Check if student has this skill
    const matched = technicalSkills.find((ts) => isSkillMatch(ts.name, reqSkill.name));

    if (matched) {
      matchingSkills.push(reqSkill.name);
      const mult = proficiencyMultipliers[matched.proficiency] || 0.85;
      earnedTechWeight += weight * mult;
    } else {
      missingSkills.push(reqSkill.name);
    }
  }

  const technicalScore = totalTechWeight > 0 ? (earnedTechWeight / totalTechWeight) * 100 : 50;

  // 2. Soft Skills Scoring (Weight: 15%)
  const requiredSoft = career.requiredSoftSkills || [];
  let matchedSoftCount = 0;

  for (const soft of requiredSoft) {
    const sLower = soft.toLowerCase().trim();
    if (softSkills.some((s) => s.includes(sLower) || sLower.includes(s))) {
      matchedSoftCount++;
    }
  }

  const softSkillScore = requiredSoft.length > 0 ? (matchedSoftCount / requiredSoft.length) * 100 : 70;

  // Explicit career interests should weigh as heavily as demonstrated technical fit.
  const interestScore = getInterestScore(interests, career);

  // 4. Sector-Aware Education Scoring (Weight: 15%)
  const educationScore = evaluateEducationForSector(student, career.sector);

  // 5. Final composite weighted match calculation (deterministic and non-random)
  const compositeScore =
    0.25 * technicalScore +
    0.10 * softSkillScore +
    0.50 * interestScore +
    0.15 * educationScore;

  // Clamp safely between 5% and 98%
  const matchPercentage = Math.min(98, Math.max(5, Math.round(compositeScore)));

  // Generate actionable next steps tailored to missing skills
  const tailoredNextSteps = [];
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3).join(', ');
    tailoredNextSteps.push(`Focus on mastering key missing requirements: ${topMissing}.`);
  }
  if (career.suggestedNextSteps && career.suggestedNextSteps.length > 0) {
    tailoredNextSteps.push(...career.suggestedNextSteps.slice(0, 2));
  }

  return {
    career: career._id,
    careerTitle: career.title,
    sector: career.sector || 'Technology',
    careerDescription: career.description,
    careerFitSummary: `Your academic background and skills align with ${career.title} opportunities in ${career.sector || 'the industry'}.`,
    matchPercentage,
    matchingSkills,
    missingSkills,
    requiredQualifications: career.requiredQualifications || [],
    suggestedNextSteps: tailoredNextSteps,
    scoreBreakdown: {
      technicalScore: Math.round(technicalScore),
      softSkillScore: Math.round(softSkillScore),
      interestAlignmentScore: Math.round(interestScore),
      educationScore: Math.round(educationScore),
    },
  };
};

/**
 * Enrich recommendations with Google Gemini AI analysis across Tech, Finance, Sales, & Management
 * @param {object} student 
 * @param {Array} topRecommendations 
 * @returns {Promise<Array|null>}
 */
export const buildCareerRecommendationsPrompt = (student, recommendations, language) => `
You are a senior university career placement counsellor advising students across disciplines.
${getContentLanguageInstruction(language)}
Analyze this student's profile and all supplied career recommendations. Return one JSON object per supplied career.

Student profile:
- Degree: ${student.degree || 'Not specified'}
- Department: ${student.department || 'Not specified'}
- CGPA: ${student.cgpa || 'Not specified'}
- Existing skills: ${JSON.stringify((student.technicalSkills || []).map((s) => `${s.name} (${s.proficiency})`))}
- Soft skills: ${JSON.stringify(student.softSkills || [])}
- Career interests: ${JSON.stringify(student.careerInterests || [])}

Careers:
${JSON.stringify(
  recommendations.map((r) => ({
    careerTitle: r.careerTitle,
    sector: r.sector,
    careerDescription: r.careerDescription,
    careerFitSummary: r.careerFitSummary,
    matchingSkills: r.matchingSkills,
    missingSkills: r.missingSkills,
    requiredQualifications: r.requiredQualifications,
    suggestedNextSteps: r.suggestedNextSteps,
  }))
)}

Return exactly these keys for each supplied career:
- "careerTitle": exact unchanged title from the input, used for matching.
- "localizedCareerTitle": natural career title in the selected language.
- "localizedSector": natural sector translation.
- "localizedCareerDescription": concise natural career description.
- "localizedCareerFitSummary": two personalized sentences explaining fit and improvement areas.
- "localizedRequiredQualifications": translated qualification array; preserve official degree and certificate names where appropriate.
- "localizedSuggestedNextSteps": three concrete personalized actions.
Keep technical skill names, programming languages, frameworks, official certificates, identifiers, and machine-readable values unchanged where appropriate.
Return only a valid JSON array. Do not translate property names, IDs, numeric values, or matching skills.
`;

const enrichWithGeminiAI = async (student, recommendations, language) => {
  try {
    const aiResult = await generateStructuredJSON(
      buildCareerRecommendationsPrompt(student, recommendations, language),
      'You are an expert multilingual career counselling AI that outputs strictly valid JSON arrays.'
    );
    return Array.isArray(aiResult) ? aiResult : null;
  } catch (err) {
    console.warn(`[Gemini AI] Career enrichment skipped: ${err.message}`);
    return null;
  }
};

/**
 * Generate or refresh career recommendations for a student
 * Evaluates all multi-sector careers and sorts by highest match
 * @param {string} userId 
 */
export const generateCareerRecommendations = async (userId) => {
  // Ensure multi-sector default careers exist in database
  await seedDefaultCareers();

  const student = await getMyProfile(userId);
  const contentLanguage = getContentLanguage(student);
  const careers = await Career.find({ isActive: true });

  if (careers.length === 0) {
    throw ApiError.internal('Career catalog is currently empty');
  }

  // Compute deterministic match for every career across all sectors
  const recommendations = careers
    .map((career) => calculateCareerMatch(student, career))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .map((recommendation) => ({
      ...recommendation,
      ...getFallbackLocalizedContent(recommendation, contentLanguage),
    }));

  // Translate descriptive fields while preserving canonical titles and match data.
  let isAIEnriched = false;
  const aiEnrichments = await enrichWithGeminiAI(student, recommendations, contentLanguage);

  if (aiEnrichments) {
    for (const enrichment of aiEnrichments) {
      const target = recommendations.find(
        (recommendation) =>
          recommendation.careerTitle.toLowerCase() === enrichment?.careerTitle?.toLowerCase()
      );
      if (target && hasValidLocalizedContent(enrichment, contentLanguage)) {
        Object.assign(target, {
          localizedCareerTitle: enrichment.localizedCareerTitle,
          localizedSector: enrichment.localizedSector,
          localizedCareerDescription: enrichment.localizedCareerDescription,
          localizedCareerFitSummary: enrichment.localizedCareerFitSummary,
          localizedRequiredQualifications: enrichment.localizedRequiredQualifications,
          localizedSuggestedNextSteps: enrichment.localizedSuggestedNextSteps,
        });
        isAIEnriched = true;
      }
    }
  }

  // Persist recommendations in MongoDB
  let recommendationRecord = await CareerRecommendation.findOne({ student: student._id });

  if (!recommendationRecord) {
    recommendationRecord = new CareerRecommendation({
      student: student._id,
      user: userId,
      recommendations,
      contentLanguage,
      isAIEnriched,
      lastAnalyzedAt: new Date(),
      version: 1,
    });
  } else {
    recommendationRecord.recommendations = recommendations;
    recommendationRecord.contentLanguage = contentLanguage;
    recommendationRecord.isAIEnriched = isAIEnriched;
    recommendationRecord.lastAnalyzedAt = new Date();
    recommendationRecord.version = (recommendationRecord.version || 1) + 1;
  }

  await recommendationRecord.save();

  return {
    studentId: student._id,
    fullName: student.fullName,
    isAIEnriched,
    contentLanguage,
    lastAnalyzedAt: recommendationRecord.lastAnalyzedAt,
    version: recommendationRecord.version,
    totalEvaluated: recommendations.length,
    topRecommendation: recommendations[0] || null,
    recommendations,
  };
};

/**
 * Retrieve current recommendations for logged-in student (auto-generates if none exist)
 * @param {string} userId 
 */
export const getStudentRecommendations = async (userId) => {
  const student = await getMyProfile(userId);
  const contentLanguage = getContentLanguage(student);

  let record = await CareerRecommendation.findOne({ student: student._id })
    .populate('recommendations.career', 'title slug sector industryDemand averageSalaryRange');

  if (
    !record ||
    record.recommendations.length === 0 ||
    record.contentLanguage !== contentLanguage
  ) {
    return await generateCareerRecommendations(userId);
  }

  return {
    studentId: student._id,
    fullName: student.fullName,
    isAIEnriched: record.isAIEnriched || false,
    contentLanguage: record.contentLanguage,
    lastAnalyzedAt: record.lastAnalyzedAt,
    version: record.version,
    totalEvaluated: record.recommendations.length,
    topRecommendation: record.recommendations[0] || null,
    recommendations: record.recommendations,
  };
};
