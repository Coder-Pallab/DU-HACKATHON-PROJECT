import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import app from '../src/app.js';
import ResumeAnalysis from '../src/models/ResumeAnalysis.js';
import { getResumeIntelligenceModelFallbacks } from '../src/services/geminiService.js';
import {
  buildResumeAuditPrompt,
  calculateJobDescriptionCompatibility,
  calculateResumeOverallScore,
  getResumeCareerCompatibility,
  validateGroundedImprovement,
  validateResumeAudit,
} from '../src/services/resumeIntelligenceService.js';
import { validateResumeCompatibility } from '../src/validators/resumeIntelligenceValidator.js';

let server;
let baseUrl;
let validationServer;
let validationUrl;

before(async () => {
  server = app.listen(0);
  validationServer = express()
    .use(express.json())
    .post('/resumes/:id/intelligence/compatibility', validateResumeCompatibility, (_req, res) => {
      res.sendStatus(204);
    })
    .listen(0);

  await Promise.all([
    new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    }),
    new Promise((resolve, reject) => {
      validationServer.once('listening', resolve);
      validationServer.once('error', reject);
    }),
  ]);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  validationUrl = `http://127.0.0.1:${validationServer.address().port}`;
});

after(async () => {
  await Promise.all([server, validationServer].filter(Boolean).map((instance) =>
    new Promise((resolve, reject) => {
      instance.close((error) => (error ? reject(error) : resolve()));
    })
  ));
});

const categoryKeys = [
  'formattingStructure',
  'professionalSummary',
  'skills',
  'education',
  'projects',
  'workExperience',
  'certificationsAchievements',
  'contactLinks',
  'careerRelevance',
  'clarityReadability',
];

const makeAudit = (overrides = {}) => ({
  categories: categoryKeys.map((key) => ({
    key,
    score: key === 'careerRelevance' ? null : 75,
    status: key === 'careerRelevance' ? 'unknown' : 'assessed',
    rationale: 'Resume evidence supports this assessment.',
    evidence: ['Built a student portal with React.'],
    ...overrides[key],
  })),
  strengths: [{ key: 'projects', text: 'The project includes a named technology.', evidence: 'Built a student portal with React.' }],
  weaknesses: [],
  recommendations: [{ key: 'projects', text: 'Explain the project contribution.', evidence: 'Built a student portal with React.' }],
});

test('builds a clear bilingual audit prompt with the evidence scoring rubric', () => {
  const prompt = buildResumeAuditPrompt({
    resumeText: 'Built a student portal with React.',
    parsedData: { projects: [{ name: 'Student Portal' }] },
    career: null,
    language: 'Assamese',
  });
  assert.match(prompt, /natural, fluent Assamese/);
  assert.match(prompt, /careerRelevance/);
  assert.match(prompt, /১০০ = শক্তিশালী/);
  assert.match(prompt, /never invent quotations/i);
});

test('resume intelligence retries with distinct alternate Gemini models', () => {
  assert.deepEqual(
    getResumeIntelligenceModelFallbacks('gemini-3.6-flash'),
    ['gemini-3.6-flash', 'gemini-3.5-flash-lite']
  );
  assert.deepEqual(
    getResumeIntelligenceModelFallbacks('gemini-3.5-flash-lite'),
    ['gemini-3.5-flash-lite']
  );
});

test('accepts grounded audit evidence and rejects invented evidence or non-rubric scores', () => {
  const text = 'Built a student portal with React.';
  assert.ok(validateResumeAudit(makeAudit(), text, false));
  assert.equal(
    validateResumeAudit(
      { ...makeAudit(), categories: makeAudit().categories.map((category, index) =>
        index === 1 ? { ...category, evidence: ['Raised revenue by 40%.'] } : category
      ) },
      text,
      false
    ),
    null
  );
  assert.equal(
    validateResumeAudit(
      { ...makeAudit(), categories: makeAudit().categories.map((category, index) =>
        index === 0 ? { ...category, score: 83 } : category
      ) },
      text,
      false
    ),
    null
  );
});

test('requires Assamese explanatory text for Assamese resume audits', () => {
  const audit = makeAudit();
  audit.categories = audit.categories.map((category) => ({
    ...category,
    rationale: 'এই মূল্যায়ন ৰেজিউমেৰ প্ৰমাণৰ ওপৰত আধাৰিত।',
  }));
  audit.strengths[0].text = 'প্ৰকল্পত এটা প্ৰযুক্তিৰ নাম উল্লেখ কৰা হৈছে।';
  audit.recommendations[0].text = 'প্ৰকল্পত আপোনাৰ অৱদান স্পষ্টকৈ লিখক।';

  assert.ok(validateResumeAudit(audit, 'Built a student portal with React.', false, 'Assamese'));
});

test('calculates the average only from assessed categories', () => {
  assert.equal(
    calculateResumeOverallScore([
      { status: 'assessed', score: 80 },
      { status: 'unknown', score: null },
      { status: 'assessed', score: 60 },
    ]),
    70
  );
  assert.equal(calculateResumeOverallScore([{ status: 'unknown', score: null }]), null);
});

test('compares resume skill keywords separately from profile suitability', () => {
  const result = getResumeCareerCompatibility(
    {
      technicalSkills: [{ name: 'React', proficiency: 'Intermediate' }],
      softSkills: [],
      careerInterests: ['Frontend Developer'],
      degree: 'BCA',
      department: 'Computer Science',
    },
    {
      parsedData: {
        technicalSkills: ['React'],
        projects: [{ name: 'Portfolio', description: 'Built using React and CSS', technologies: ['React'] }],
      },
    },
    {
      title: 'Frontend Developer',
      sector: 'Technology',
      requiredTechnicalSkills: [{ name: 'React' }, { name: 'JavaScript' }],
      requiredSoftSkills: [],
      requiredQualifications: [],
      suggestedNextSteps: [],
    }
  );
  assert.equal(result.keywordMatchScore, 50);
  assert.equal(typeof result.careerSuitabilityScore, 'number');
  assert.deepEqual(result.matchingSkills, ['React']);
  assert.deepEqual(result.missingSkills, ['JavaScript']);
  assert.deepEqual(result.relevantProjects, ['Portfolio']);
  assert.match(result.disclaimer, /Neither predicts ATS/i);
});

test('matches job-description keywords only against the known career catalogue', () => {
  const result = calculateJobDescriptionCompatibility(
    { technicalSkills: [{ name: 'React' }] },
    {
      parsedData: { technicalSkills: ['React'], projects: [] },
      extractedText: 'React development experience',
    },
    'Seeking React and Kubernetes skills.',
    [{ requiredTechnicalSkills: [{ name: 'React' }, { name: 'Kubernetes' }] }]
  );
  assert.equal(result.keywordMatchScore, 50);
  assert.deepEqual(result.matchingSkills, ['react']);
  assert.deepEqual(result.missingSkills, ['Kubernetes']);
  assert.deepEqual(result.missingKeywords, ['Kubernetes']);
  assert.match(result.matchingMethod, /unknown terms are not guessed/);
});

test('rejects improvement drafts unsupported by exact facts or with invented numbers', () => {
  const facts = ['Project: Student Portal — React'];
  assert.deepEqual(
    validateGroundedImprovement(
      { content: 'Built Student Portal with React.', evidence: [facts[0]] },
      facts
    ),
    { content: 'Built Student Portal with React.', evidence: [facts[0]] }
  );
  assert.equal(
    validateGroundedImprovement(
      { content: 'Improved performance by 40%.', evidence: [facts[0]] },
      facts
    ),
    null
  );
  assert.equal(
    validateGroundedImprovement(
      { content: 'Built a mobile banking app.', evidence: ['No such source fact'] },
      facts
    ),
    null
  );
  assert.equal(
    validateGroundedImprovement(
      { content: 'মই ৪ বছৰৰ অভিজ্ঞতা লাভ কৰিলোঁ।', evidence: [facts[0]] },
      ['Experience: 3 years'],
      'Assamese'
    ),
    null
  );
  assert.deepEqual(
    validateGroundedImprovement(
      { content: 'মই ৩ বছৰৰ অভিজ্ঞতা লাভ কৰিলোঁ।', evidence: ['Experience: 3 years'] },
      ['Experience: 3 years'],
      'Assamese'
    ),
    { content: 'মই ৩ বছৰৰ অভিজ্ঞতা লাভ কৰিলোঁ।', evidence: ['Experience: 3 years'] }
  );
});

test('stores unknown scores without fabricating a numeric overall score', async () => {
  const analysis = new ResumeAnalysis({
    user: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    resume: '507f1f77bcf86cd799439013',
    language: 'English',
    analysisStatus: 'insufficient_data',
    categoryScores: [
      {
        key: 'education',
        label: 'Education',
        score: null,
        status: 'unknown',
        rationale: 'The source text was unavailable.',
      },
    ],
    disclaimer: 'Not an ATS score.',
    sourceUpdatedAt: new Date(),
  });
  await analysis.validate();
  assert.equal(analysis.overallScore, null);
});

test('compatibility validation requires exactly one supported target', async () => {
  const invalid = await fetch(`${validationUrl}/resumes/507f1f77bcf86cd799439011/intelligence/compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const valid = await fetch(`${validationUrl}/resumes/507f1f77bcf86cd799439011/intelligence/compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerId: 'frontend-developer' }),
  });
  assert.equal(invalid.status, 422);
  assert.equal(valid.status, 204);
});

test('resume intelligence endpoints require authentication', async () => {
  const response = await fetch(`${baseUrl}/api/v1/resumes/507f1f77bcf86cd799439011/intelligence/analyses`);
  assert.equal(response.status, 401);
});
