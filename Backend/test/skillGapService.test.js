import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import app from '../src/app.js';
import { buildSkillGapResult } from '../src/services/skillGapService.js';
import { validateSkillGapRequest } from '../src/validators/skillGapValidator.js';

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

test('builds prioritized gaps from career requirements and student skills', () => {
  const result = buildSkillGapResult(
    {
      technicalSkills: [{ name: 'JS', proficiency: 'Advanced' }],
      softSkills: ['Communication'],
      careerInterests: [],
      degree: 'B.Tech',
      department: 'Computer Science',
      cgpa: 8,
    },
    {
      _id: 'career-id',
      title: 'Frontend Developer',
      sector: 'Technology',
      description: 'Build user interfaces.',
      requiredTechnicalSkills: [
        { name: 'JavaScript', importance: 'Core', weight: 2 },
        { name: 'React', importance: 'Core', weight: 2 },
        { name: 'Git', importance: 'Preferred', weight: 1 },
      ],
      requiredSoftSkills: ['Communication', 'Collaboration'],
      requiredQualifications: [],
      suggestedNextSteps: [],
    }
  );

  assert.deepEqual(result.matchingSkills, ['JavaScript', 'Communication']);
  assert.equal(result.matchPercentage, 45);
  assert.deepEqual(
    result.missingSkills.map(({ name, category, priority }) => ({ name, category, priority })),
    [
      { name: 'React', category: 'Technical', priority: 'High' },
      { name: 'Collaboration', category: 'Soft Skill', priority: 'Low' },
      { name: 'Git', category: 'Technical', priority: 'Low' },
    ]
  );
  assert.ok(result.matchPercentage >= 0 && result.matchPercentage <= 100);
});

test('returns no gaps when every required technical and soft skill is present', () => {
  const result = buildSkillGapResult(
    {
      technicalSkills: [
        { name: 'JavaScript', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Intermediate' },
      ],
      softSkills: ['Communication', 'Teamwork'],
      careerInterests: [],
      degree: '',
      department: '',
      cgpa: 0,
    },
    {
      title: 'Frontend Developer',
      sector: 'Technology',
      requiredTechnicalSkills: [
        { name: 'JavaScript', importance: 'Core', weight: 2 },
        { name: 'React', importance: 'Core', weight: 2 },
      ],
      requiredSoftSkills: ['Communication', 'Teamwork'],
      requiredQualifications: [],
      suggestedNextSteps: [],
    }
  );

  assert.deepEqual(result.missingSkills, []);
});

test('skill-gap analysis endpoints require authentication', async () => {
  const analyzeResponse = await fetch(`${baseUrl}/api/v1/ai/skill-gap/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerId: 'frontend-developer' }),
  });
  const retrieveResponse = await fetch(`${baseUrl}/api/v1/ai/skill-gap/frontend-developer`);

  assert.equal(analyzeResponse.status, 401);
  assert.equal(retrieveResponse.status, 401);
});

test('validates a career identifier before starting analysis', async () => {
  const validationApp = express();
  validationApp.use(express.json());
  validationApp.post('/skill-gap', validateSkillGapRequest, (req, res) => res.sendStatus(204));

  const validationServer = validationApp.listen(0);
  await new Promise((resolve, reject) => {
    validationServer.once('listening', resolve);
    validationServer.once('error', reject);
  });

  try {
    const baseValidationUrl = `http://127.0.0.1:${validationServer.address().port}/skill-gap`;
    const invalidResponse = await fetch(baseValidationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ careerId: 'not a career id' }),
    });
    const validResponse = await fetch(baseValidationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ careerId: 'frontend-developer' }),
    });

    assert.equal(invalidResponse.status, 422);
    assert.equal(validResponse.status, 204);
  } finally {
    await new Promise((resolve, reject) => {
      validationServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
