import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import MockInterview from '../src/models/MockInterview.js';
import { getStructuredAIErrorMessage } from '../src/services/geminiService.js';
import {
  buildMockInterviewEvaluationPrompt,
  buildMockInterviewQuestionPrompt,
  validateGeneratedQuestions,
  validateInterviewEvaluation,
} from '../src/services/mockInterviewService.js';

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

test('builds bilingual AI interview prompts from the selected language', () => {
  const student = {
    degree: 'B.Com',
    department: 'Commerce',
    technicalSkills: [{ name: 'Excel' }],
    softSkills: ['Communication'],
  };
  const career = {
    title: 'Accountant',
    sector: 'Finance & Banking',
    description: 'Maintains financial records.',
  };

  const questionPrompt = buildMockInterviewQuestionPrompt(student, career, 'Assamese');
  const evaluationPrompt = buildMockInterviewEvaluationPrompt(
    'How do you check a ledger?',
    'I compare the entries.',
    career,
    'Assamese'
  );
  assert.match(questionPrompt, /natural, fluent Assamese/);
  assert.match(evaluationPrompt, /natural, fluent Assamese/);
  assert.match(
    buildMockInterviewQuestionPrompt(student, career, 'English'),
    /clear, professional English/
  );
});

test('rejects incomplete or wrong-language generated questions', () => {
  assert.equal(validateGeneratedQuestions({ questions: [{ prompt: 'A question?' }] }, 'English'), null);
  assert.equal(
    validateGeneratedQuestions(
      { questions: Array.from({ length: 5 }, (_, index) => ({ prompt: `প্রশ্ন ${index + 1}?` })) },
      'Assamese'
    )?.length,
    5
  );
  assert.equal(
    validateGeneratedQuestions(
      { questions: Array.from({ length: 5 }, (_, index) => ({ prompt: `Question ${index + 1}?` })) },
      'Assamese'
    ),
    null
  );
});

test('validates AI answer scores and localized feedback', () => {
  const valid = validateInterviewEvaluation(
    {
      score: 82,
      feedback: 'আপোনাৰ উত্তৰটো স্পষ্ট আৰু প্ৰাসংগিক।',
      strengths: ['মূল কথাটো ভালদৰে ব্যাখ্যা কৰিছে।'],
      improvements: ['এটা উদাহৰণ যোগ কৰিলে উত্তৰ অধিক শক্তিশালী হ’ব।'],
    },
    'Assamese'
  );
  assert.equal(valid.score, 82);
  assert.equal(
    validateInterviewEvaluation(
      { score: 150, feedback: 'আপোনাৰ উত্তৰ।', strengths: [], improvements: [] },
      'Assamese'
    ),
    null
  );
});

test('reports Gemini quota and overload errors accurately', () => {
  assert.match(
    getStructuredAIErrorMessage(new Error('429 Too Many Requests: quota exceeded')),
    /quota or rate limit reached/i
  );
  assert.match(
    getStructuredAIErrorMessage(new Error('503 Service Unavailable: high demand')),
    /temporarily overloaded/i
  );
});

test('mock interview model requires questions and restricts scores', async () => {
  const interview = new MockInterview({
    user: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    career: '507f1f77bcf86cd799439013',
    careerTitle: 'Accountant',
    contentLanguage: 'English',
    questions: [{ prompt: 'How do you reconcile an account?' }],
  });
  await interview.validate();

  interview.questions[0].score = 101;
  await assert.rejects(interview.validate(), /maximum allowed value \(100\)/);
});

test('mock interview endpoints require authentication', async () => {
  const listResponse = await fetch(`${baseUrl}/api/v1/ai/interviews`);
  const createResponse = await fetch(`${baseUrl}/api/v1/ai/interviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerId: 'accountant' }),
  });
  assert.equal(listResponse.status, 401);
  assert.equal(createResponse.status, 401);
});
