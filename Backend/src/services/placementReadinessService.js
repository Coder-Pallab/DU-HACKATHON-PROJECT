import PlacementReadinessAssessment from '../models/PlacementReadinessAssessment.js';
import Resume from '../models/Resume.js';
import LearningRoadmap from '../models/LearningRoadmap.js';
import MockInterview from '../models/MockInterview.js';
import { ApiError } from '../utils/apiError.js';
import { calculateCareerMatch } from './careerRecommendationService.js';
import { getCareerById } from './careerService.js';
import { getContentLanguage } from './aiContentLanguage.js';
import { getMyProfile } from './studentService.js';

const LABELS = {
  English: {
    technical: 'Technical skills',
    soft: 'Soft skills',
    resume: 'Resume completeness',
    projects: 'Practical projects',
    learning: 'Learning progress',
    interview: 'Mock interview performance',
    strengths: 'Your strongest measured areas are',
    improvements: 'The lowest measured areas are',
    noAdditionalData: 'Only career skill requirements could be assessed because no analyzed resume, roadmap, or completed mock interview is available yet.',
    fullExplanation: 'The score is a weighted average of available profile skills, resume, projects, learning progress, and completed mock-interview evidence. Categories without data are excluded, not treated as zero.',
    disclaimer: 'This score summarizes available preparation evidence. It is not a scientifically validated prediction of employment or hiring outcomes.',
    addSkills: (skills) => `Build or demonstrate these career skills: ${skills.join(', ')}.`,
    analyzeResume: 'Upload and analyze a resume to assess its completeness and identify evidence to strengthen.',
    addProjects: 'Add practical projects to your resume that demonstrate the selected career skills.',
    continueRoadmap: 'Generate or continue a learning roadmap to track progress toward this career.',
    practiceInterview: 'Complete a mock interview to add interview-practice evidence to this assessment.',
    noGaps: 'Keep practicing and document your work to maintain your current skill alignment.',
    skillEvidence: (score) => `Career requirements match score: ${score}%.`,
    resumeEvidence: (sections) => `Resume sections found: ${sections.join(', ')}.`,
    projectEvidence: (count) => `${count} project${count === 1 ? '' : 's'} found in the analyzed resume.`,
    learningEvidence: (score) => `Latest roadmap completion: ${score}%.`,
    interviewEvidence: (count, score) => `${count} completed mock interview${count === 1 ? '' : 's'}; average answer score: ${score}%.`,
  },
  Assamese: {
    technical: 'কাৰিকৰী দক্ষতা',
    soft: 'ব্যক্তিগত দক্ষতা',
    resume: 'ৰেজিউমেৰ সম্পূৰ্ণতা',
    projects: 'ব্যৱহাৰিক প্ৰকল্প',
    learning: 'শিক্ষণৰ অগ্ৰগতি',
    interview: 'মক ইণ্টাৰভিউৰ প্ৰদৰ্শন',
    strengths: 'আপোনাৰ সৰ্বাধিক মাপ কৰা শক্তিশালী ক্ষেত্ৰসমূহ',
    improvements: 'অধিক উন্নতিৰ প্ৰয়োজন হোৱা মাপ কৰা ক্ষেত্ৰসমূহ',
    noAdditionalData: 'এতিয়ালৈকে বিশ্লেষণ কৰা ৰেজিউমে, ৰোডমেপ বা সম্পূৰ্ণ মক ইণ্টাৰভিউ নাই; সেয়ে কেৱল কেৰিয়াৰৰ দক্ষতাৰ প্ৰয়োজনীয়তাহে মূল্যায়ন কৰা হৈছে।',
    fullExplanation: 'উপলব্ধ প্ৰফাইলৰ দক্ষতা, ৰেজিউমে, প্ৰকল্প, শিক্ষণৰ অগ্ৰগতি আৰু সম্পূৰ্ণ মক ইণ্টাৰভিউৰ প্ৰমাণৰ ওজনযুক্ত গড় হিচাপে এই স্ক’ৰ গণনা কৰা হৈছে। তথ্য নথকা শ্ৰেণীসমূহ বাদ দিয়া হয়, শূন্য ধৰা নহয়।',
    disclaimer: 'এই স্ক’ৰে উপলব্ধ প্ৰস্তুতিৰ প্ৰমাণৰ সাৰাংশ দিয়ে। ই চাকৰি বা নিয়োগৰ ফলাফলৰ বৈজ্ঞানিকভাৱে প্ৰমাণিত পূৰ্বানুমান নহয়।',
    addSkills: (skills) => `এই কেৰিয়াৰৰ বাবে তলৰ দক্ষতাসমূহ বিকাশ বা প্ৰদৰ্শন কৰক: ${skills.join(', ')}।`,
    analyzeResume: 'সম্পূৰ্ণতা মূল্যায়ন আৰু উন্নত কৰিবলগীয়া প্ৰমাণ চিনাক্ত কৰিবলৈ ৰেজিউমে আপলোড কৰি বিশ্লেষণ কৰক।',
    addProjects: 'নিৰ্বাচিত কেৰিয়াৰৰ দক্ষতা প্ৰদৰ্শন কৰা ব্যৱহাৰিক প্ৰকল্প ৰেজিউমেত যোগ কৰক।',
    continueRoadmap: 'এই কেৰিয়াৰৰ দিশত অগ্ৰগতি অনুসৰণ কৰিবলৈ শিক্ষণ ৰোডমেপ তৈয়াৰ কৰক বা আগবঢ়াই নিয়ক।',
    practiceInterview: 'ইণ্টাৰভিউৰ অনুশীলনৰ প্ৰমাণ যোগ কৰিবলৈ এটা মক ইণ্টাৰভিউ সম্পূৰ্ণ কৰক।',
    noGaps: 'আপোনাৰ বৰ্তমানৰ দক্ষতাৰ মিল বজাই ৰাখিবলৈ অনুশীলন কৰি থাকক আৰু কামৰ প্ৰমাণ নথিভুক্ত কৰক।',
    skillEvidence: (score) => `কেৰিয়াৰৰ প্ৰয়োজনীয়তাৰ সৈতে দক্ষতাৰ মিল: ${score}%。`,
    resumeEvidence: (sections) => `ৰেজিউমেত পোৱা শাখাসমূহ: ${sections.join(', ')}।`,
    projectEvidence: (count) => `বিশ্লেষণ কৰা ৰেজিউমেত ${count}টা প্ৰকল্প পোৱা গৈছে।`,
    learningEvidence: (score) => `শেহতীয়া ৰোডমেপৰ অগ্ৰগতি: ${score}%。`,
    interviewEvidence: (count, score) => `${count}টা সম্পূৰ্ণ মক ইণ্টাৰভিউ; উত্তৰৰ গড় স্ক’ৰ: ${score}%。`,
  },
};

const addCategory = (categories, key, label, score, weight, evidence) => {
  if (Number.isFinite(score) && weight > 0) {
    categories.push({ key, label, score: Math.round(score), weight, evidence });
  }
};

export const buildPlacementReadiness = ({
  student,
  career,
  resume,
  roadmap,
  interviews = [],
  language = 'English',
}) => {
  const copy = LABELS[language] || LABELS.English;
  const categories = [];
  const match = calculateCareerMatch(student, career);
  const missingTechnical = (career.requiredTechnicalSkills || [])
    .filter((required) => match.missingSkills.includes(required.name))
    .map(({ name }) => name);
  const savedSoftSkills = (student.softSkills || []).map((skill) => skill.toLowerCase().trim());
  const missingSoftSkills = (career.requiredSoftSkills || []).filter((required) => {
    const requiredSkill = required.toLowerCase().trim();
    return !savedSoftSkills.some(
      (savedSkill) => savedSkill.includes(requiredSkill) || requiredSkill.includes(savedSkill)
    );
  });

  if ((career.requiredTechnicalSkills || []).length > 0) {
    addCategory(categories, 'technicalSkills', copy.technical, match.scoreBreakdown.technicalScore, 35, [
      copy.skillEvidence(match.scoreBreakdown.technicalScore),
    ]);
  }
  if ((career.requiredSoftSkills || []).length > 0) {
    addCategory(categories, 'softSkills', copy.soft, match.scoreBreakdown.softSkillScore, 15, [
      copy.skillEvidence(match.scoreBreakdown.softSkillScore),
    ]);
  }

  const parsedData = resume?.parsingStatus === 'analyzed' ? resume.parsedData : null;
  if (parsedData) {
    const sections = [
      ['education', parsedData.education],
      ['technical skills', parsedData.technicalSkills],
      ['work experience', parsedData.workExperience],
      ['projects', parsedData.projects],
      ['certifications', parsedData.certifications],
    ];
    const presentSections = sections.filter(([, items]) => Array.isArray(items) && items.length > 0);
    addCategory(
      categories,
      'resumeCompleteness',
      copy.resume,
      (presentSections.length / sections.length) * 100,
      20,
      [copy.resumeEvidence(presentSections.map(([name]) => name))]
    );

    const projectCount = Array.isArray(parsedData.projects) ? parsedData.projects.length : 0;
    addCategory(
      categories,
      'projects',
      copy.projects,
      projectCount === 0 ? 0 : Math.min(100, 60 + (projectCount - 1) * 20),
      10,
      [copy.projectEvidence(projectCount)]
    );
  }

  if (roadmap) {
    addCategory(categories, 'learningProgress', copy.learning, roadmap.progressPercent, 10, [
      copy.learningEvidence(roadmap.progressPercent),
    ]);
  }

  const completedInterviews = interviews.filter(
    (interview) => interview.status === 'completed' && Number.isFinite(interview.overallScore)
  );
  if (completedInterviews.length > 0) {
    const interviewScore =
      completedInterviews.reduce((total, interview) => total + interview.overallScore, 0) /
      completedInterviews.length;
    addCategory(categories, 'interviewPerformance', copy.interview, interviewScore, 10, [
      copy.interviewEvidence(completedInterviews.length, Math.round(interviewScore)),
    ]);
  }

  const totalWeight = categories.reduce((total, category) => total + category.weight, 0);
  const overallScore = totalWeight
    ? Math.round(
        categories.reduce((total, category) => total + category.score * category.weight, 0) /
          totalWeight
      )
    : null;
  const strengths = categories.filter(({ score }) => score >= 75).map(({ label }) => label);
  const areasToImprove = categories.filter(({ score }) => score < 60).map(({ label }) => label);
  const recommendations = [];

  const missingSkills = [...missingTechnical, ...missingSoftSkills];
  if (missingSkills.length > 0) recommendations.push(copy.addSkills(missingSkills.slice(0, 5)));
  if (!parsedData) recommendations.push(copy.analyzeResume);
  else if (!Array.isArray(parsedData.projects) || parsedData.projects.length === 0) {
    recommendations.push(copy.addProjects);
  }
  if (!roadmap) recommendations.push(copy.continueRoadmap);
  if (completedInterviews.length === 0) recommendations.push(copy.practiceInterview);
  if (recommendations.length === 0) recommendations.push(copy.noGaps);

  const parts = [];
  if (strengths.length > 0) parts.push(`${copy.strengths}: ${strengths.join(', ')}.`);
  if (areasToImprove.length > 0) {
    parts.push(`${copy.improvements}: ${areasToImprove.join(', ')}.`);
  }
  if (!parsedData && !roadmap && completedInterviews.length === 0) {
    parts.push(copy.noAdditionalData);
  }
  parts.push(copy.fullExplanation);

  return {
    overallScore,
    assessmentStatus: totalWeight ? 'assessed' : 'insufficient_data',
    categoryScores: categories,
    strengths,
    areasToImprove,
    recommendations,
    explanation: parts.join(' '),
    disclaimer: copy.disclaimer,
  };
};

const getReadinessInputs = async (userId, careerId) => {
  const [student, career] = await Promise.all([getMyProfile(userId), getCareerById(careerId)]);
  if (!career.isActive) throw ApiError.notFound('Career is not available');
  const [resume, roadmap, interviews] = await Promise.all([
    Resume.findOne({ user: userId, parsingStatus: 'analyzed' }).sort({ updatedAt: -1 }),
    LearningRoadmap.findOne({ user: userId, student: student._id, career: career._id }).sort({
      updatedAt: -1,
    }),
    MockInterview.find({
      user: userId,
      student: student._id,
      career: career._id,
      status: 'completed',
    }).select('overallScore status'),
  ]);
  return { student, career, resume, roadmap, interviews };
};

export const createPlacementReadinessAssessment = async (userId, careerId) => {
  const inputs = await getReadinessInputs(userId, careerId);
  const result = buildPlacementReadiness({
    ...inputs,
    language: getContentLanguage(inputs.student),
  });
  return PlacementReadinessAssessment.create({
    user: userId,
    student: inputs.student._id,
    career: inputs.career._id,
    careerTitle: inputs.career.title,
    contentLanguage: getContentLanguage(inputs.student),
    ...result,
  });
};

export const getLatestPlacementReadinessAssessment = async (userId, careerId) => {
  const student = await getMyProfile(userId);
  const career = await getCareerById(careerId);
  const assessment = await PlacementReadinessAssessment.findOne({
    user: userId,
    student: student._id,
    career: career._id,
  }).sort({ createdAt: -1 });
  return assessment;
};
