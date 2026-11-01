import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import app from '../src/app.js';
import LearningRoadmap from '../src/models/LearningRoadmap.js';
import { buildRoadmapPhases } from '../src/services/learningRoadmapService.js';
import { validateRoadmapPhaseProgress } from '../src/validators/learningRoadmapValidator.js';

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

test('builds a prioritized weekly plan from saved skill gaps', () => {
  const phases = buildRoadmapPhases(
    {
      missingSkills: [
        {
          name: 'React',
          category: 'Technical',
          priority: 'High',
          learningSteps: ['Build a reusable component.'],
        },
        {
          name: 'Communication',
          category: 'Soft Skill',
          priority: 'Low',
          learningSteps: ['Practice a project presentation.'],
        },
      ],
    },
    { title: 'Frontend Developer' }
  );

  assert.deepEqual(
    phases.map(({ focusSkill, weekStart, weekEnd, activities }) => ({
      focusSkill,
      weekStart,
      weekEnd,
      activities,
    })),
    [
      {
        focusSkill: 'React',
        weekStart: 1,
        weekEnd: 2,
        activities: ['Build a reusable component.'],
      },
      {
        focusSkill: 'Communication',
        weekStart: 3,
        weekEnd: 3,
        activities: ['Practice a project presentation.'],
      },
    ]
  );
});

test('creates a career-readiness plan when the student has no skill gaps', () => {
  const phases = buildRoadmapPhases(
    { missingSkills: [] },
    { title: 'Data Analyst', suggestedNextSteps: ['Build a dashboard.', 'Present findings.'] }
  );

  assert.equal(phases.length, 1);
  assert.equal(phases[0].category, 'Career');
  assert.deepEqual(phases[0].activities, ['Build a dashboard.', 'Present findings.']);
});

test('roadmap model rejects an empty phase list', async () => {
  const roadmap = new LearningRoadmap({
    student: '507f1f77bcf86cd799439011',
    user: '507f1f77bcf86cd799439012',
    career: '507f1f77bcf86cd799439013',
    sourceAnalysis: '507f1f77bcf86cd799439014',
    careerTitle: 'Frontend Developer',
    summary: 'A sample persisted roadmap.',
    phases: [],
  });

  await assert.rejects(roadmap.validate(), (error) => {
    assert.match(error.message, /at least one phase/);
    return true;
  });
});

test('roadmap endpoints require authentication', async () => {
  const generateResponse = await fetch(`${baseUrl}/api/v1/ai/roadmaps/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerId: 'frontend-developer' }),
  });
  const retrieveResponse = await fetch(`${baseUrl}/api/v1/ai/roadmaps/frontend-developer`);
  const progressResponse = await fetch(
    `${baseUrl}/api/v1/ai/roadmaps/507f1f77bcf86cd799439011/phases/507f1f77bcf86cd799439012`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    }
  );

  assert.equal(generateResponse.status, 401);
  assert.equal(retrieveResponse.status, 401);
  assert.equal(progressResponse.status, 401);
});

test('roadmap phase progress accepts only valid phase states', async () => {
  const validationApp = express();
  validationApp.use(express.json());
  validationApp.patch(
    '/roadmaps/:roadmapId/phases/:phaseId',
    validateRoadmapPhaseProgress,
    (req, res) => res.sendStatus(204)
  );
  const validationServer = validationApp.listen(0);
  await new Promise((resolve, reject) => {
    validationServer.once('listening', resolve);
    validationServer.once('error', reject);
  });

  try {
    const url = `http://127.0.0.1:${validationServer.address().port}/roadmaps/507f1f77bcf86cd799439011/phases/507f1f77bcf86cd799439012`;
    const invalidResponse = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'skipped' }),
    });
    const validResponse = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });

    assert.equal(invalidResponse.status, 422);
    assert.equal(validResponse.status, 204);
  } finally {
    await new Promise((resolve, reject) => {
      validationServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
