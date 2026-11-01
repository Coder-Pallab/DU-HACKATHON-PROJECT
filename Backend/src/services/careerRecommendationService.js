import Career from '../models/Career.js';
import CareerRecommendation from '../models/CareerRecommendation.js';
import Student from '../models/Student.js';
import { ApiError } from '../utils/apiError.js';
import { seedDefaultCareers } from './careerService.js';
import { getMyProfile } from './studentService.js';
import { generateStructuredJSON } from './geminiService.js';

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

  // 3. Career Interest & Sector Alignment (Weight: 20%)
  const careerTitleLower = career.title.toLowerCase();
  const careerSectorLower = (career.sector || '').toLowerCase();
  let interestScore = 35; // Baseline if not explicitly listed

  for (const interest of interests) {
    // Direct career title match
    if (interest === careerTitleLower || careerTitleLower.includes(interest) || interest.includes(careerTitleLower)) {
      interestScore = 100;
      break;
    }

    // Direct sector match (e.g. interest is 'Finance' and career is in 'Finance & Banking')
    if (careerSectorLower.includes(interest) || interest.includes('finance') && careerSectorLower.includes('finance')) {
      interestScore = Math.max(interestScore, 90);
    } else if (interest.includes('sales') && careerSectorLower.includes('sales')) {
      interestScore = Math.max(interestScore, 90);
    } else if (interest.includes('marketing') && careerSectorLower.includes('marketing')) {
      interestScore = Math.max(interestScore, 90);
    } else if (interest.includes('management') && careerSectorLower.includes('management')) {
      interestScore = Math.max(interestScore, 90);
    }

    // Partial keyword matches
    const careerWords = careerTitleLower.split(' ');
    const interestWords = interest.split(' ');
    const hasOverlap = careerWords.some((w) => w.length > 2 && interestWords.includes(w));
    if (hasOverlap) {
      interestScore = Math.max(interestScore, 75);
    }
  }

  // 4. Sector-Aware Education Scoring (Weight: 15%)
  const educationScore = evaluateEducationForSector(student, career.sector);

  // 5. Final Composite Weighted Match Calculation (Deterministic & Non-Random)
  const compositeScore =
    0.50 * technicalScore +
    0.15 * softSkillScore +
    0.20 * interestScore +
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
const enrichWithGeminiAI = async (student, topRecommendations) => {
  const prompt = `
You are a senior university career placement counsellor advising university students across diverse disciplines (Engineering, Commerce, Management, Humanities).
Analyze this student's university profile and our matching engine's top career recommendations:

Student Profile:
- Full Name: ${student.fullName}
- Degree: ${student.degree || 'Not specified'}
- Department: ${student.department || 'Not specified'}
- College: ${student.college || 'Not specified'}
- CGPA: ${student.cgpa || 'Not specified'}
- Existing Skills: ${JSON.stringify((student.technicalSkills || []).map((s) => `${s.name} (${s.proficiency})`))}
- Soft Skills: ${JSON.stringify(student.softSkills || [])}
- Target Career Interests: ${JSON.stringify(student.careerInterests || [])}

Top Recommended Careers:
${JSON.stringify(
  topRecommendations.map((r) => ({
    careerTitle: r.careerTitle,
    sector: r.sector,
    matchPercentage: `${r.matchPercentage}%`,
    matchingSkills: r.matchingSkills,
    missingSkills: r.missingSkills,
  }))
)}

For each recommended career, generate customized career counselling advice:
1. "careerTitle": Exact career title from above
2. "careerFitSummary": 2 sentences explaining why this student's specific academic background and skill set makes them a strong contender in this sector.
3. "aiNextSteps": Array of 3 concrete, personalized action items (e.g. project to build, certification, or industry prep milestone tailored to their sector).

Return a valid JSON array of objects conforming to this schema.
`;

  try {
    const aiResult = await generateStructuredJSON(
      prompt,
      'You are an expert career counselling AI that outputs strictly valid JSON arrays of recommendations.'
    );

    if (Array.isArray(aiResult) && aiResult.length > 0) {
      return aiResult;
    }
  } catch (err) {
    console.warn(`[Gemini AI] Career enrichment skipped: ${err.message}`);
  }

  return null;
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
  const careers = await Career.find({ isActive: true });

  if (careers.length === 0) {
    throw ApiError.internal('Career catalog is currently empty');
  }

  // Compute deterministic match for every career across all sectors
  const recommendations = careers
    .map((career) => calculateCareerMatch(student, career))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Invoke Google Gemini AI to enrich the top 3 recommendations
  let isAIEnriched = false;
  const aiEnrichments = await enrichWithGeminiAI(student, recommendations.slice(0, 3));

  if (aiEnrichments && Array.isArray(aiEnrichments)) {
    isAIEnriched = true;
    for (const enrichment of aiEnrichments) {
      const target = recommendations.find(
        (r) => r.careerTitle.toLowerCase() === enrichment.careerTitle?.toLowerCase()
      );
      if (target) {
        if (enrichment.careerFitSummary) {
          target.careerFitSummary = enrichment.careerFitSummary;
        }
        if (Array.isArray(enrichment.aiNextSteps) && enrichment.aiNextSteps.length > 0) {
          target.suggestedNextSteps = enrichment.aiNextSteps;
        }
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
      isAIEnriched,
      lastAnalyzedAt: new Date(),
      version: 1,
    });
  } else {
    recommendationRecord.recommendations = recommendations;
    recommendationRecord.isAIEnriched = isAIEnriched;
    recommendationRecord.lastAnalyzedAt = new Date();
    recommendationRecord.version = (recommendationRecord.version || 1) + 1;
  }

  await recommendationRecord.save();

  return {
    studentId: student._id,
    fullName: student.fullName,
    isAIEnriched,
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

  let record = await CareerRecommendation.findOne({ student: student._id })
    .populate('recommendations.career', 'title slug sector industryDemand averageSalaryRange');

  if (!record || record.recommendations.length === 0) {
    return await generateCareerRecommendations(userId);
  }

  return {
    studentId: student._id,
    fullName: student.fullName,
    isAIEnriched: record.isAIEnriched || false,
    lastAnalyzedAt: record.lastAnalyzedAt,
    version: record.version,
    totalEvaluated: record.recommendations.length,
    topRecommendation: record.recommendations[0] || null,
    recommendations: record.recommendations,
  };
};
