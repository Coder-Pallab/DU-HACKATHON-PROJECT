import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import PlacementReadinessAssessment from '../src/models/PlacementReadinessAssessment.js';
import { buildPlacementReadiness } from '../src/services/placementReadinessService.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

const career = {
  title: 'Frontend Developer',
  sector: 'Technology',
  requiredTechnicalSkills: [{ name: 'JavaScript', weight: 1 }],
  requiredSoftSkills: ['Communication'],
  requiredQualifications: [],
  suggestedNextSteps: [],
};

test('computes readiness from available skill evidence and excludes unavailable data', () => {
  const result = buildPlacementReadiness({
    student: {
      technicalSkills: [{ name: 'JavaScript', proficiency: 'Advanced' }],
      softSkills: ['Communication'],
      careerInterests: ['Frontend Developer'],
      degree: 'BCA',
    },
    career,
  });

  assert.equal(result.assessmentStatus, 'assessed');
  assert.equal(result.overallScore, 100);
  assert.deepEqual(
    result.categoryScores.map(({ key, weight }) => ({ key, weight })),
    [
      { key: 'technicalSkills', weight: 35 },
      { key: 'softSkills', weight: 15 },
    ]
  );
  assert.ok(result.recommendations.some((recommendation) => recommendation.includes('resume')));
  assert.ok(!result.categoryScores.some(({ key }) => key === 'resumeCompleteness'));
});

test('returns insufficient-data instead of inventing a readiness score', () => {
  const result = buildPlacementReadiness({
    student: {},
    career: { title: 'General Career', requiredTechnicalSkills: [], requiredSoftSkills: [] },
  });

  assert.equal(result.assessmentStatus, 'insufficient_data');
  assert.equal(result.overallScore, null);
  assert.deepEqual(result.categoryScores, []);
});

test('uses Assamese explanations and preserves machine-readable category keys', () => {
  const result = buildPlacementReadiness({
    student: { technicalSkills: [], softSkills: [], careerInterests: [] },
    career,
    language: 'Assamese',
  });

  assert.equal(result.assessmentStatus, 'assessed');
  assert.ok(/[\u0980-\u09FF]/u.test(result.explanation));
  assert.ok(/[\u0980-\u09FF]/u.test(result.disclaimer));
  assert.deepEqual(
    result.categoryScores.map(({ key }) => key),
    ['technicalSkills', 'softSkills']
  );
});

test('stores insufficient-data assessments without a fabricated numeric score', async () => {
  const assessment = new PlacementReadinessAssessment({
    user: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    career: '507f1f77bcf86cd799439013',
    careerTitle: 'General Career',
    contentLanguage: 'English',
    overallScore: null,
    assessmentStatus: 'insufficient_data',
    explanation: 'No measurable data is available yet.',
    disclaimer: 'This is not a prediction of employment outcomes.',
  });
  await assessment.validate();
  assert.equal(assessment.overallScore, null);
});

test('placement readiness endpoints require authentication', async () => {
  const createResponse = await fetch(`${baseUrl}/api/v1/students/me/readiness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerId: 'accountant' }),
  });
  const retrieveResponse = await fetch(
    `${baseUrl}/api/v1/students/me/readiness/accountant`
  );
  assert.equal(createResponse.status, 401);
  assert.equal(retrieveResponse.status, 401);
});
