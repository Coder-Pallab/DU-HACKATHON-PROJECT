import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import app from '../src/app.js';
import CareerCounsellingConversation from '../src/models/CareerCounsellingConversation.js';
import { LANGUAGES } from '../src/constants/languages.js';
import {
  buildCounsellorPrompt,
  buildCounsellorSystemInstruction,
} from '../src/services/careerCounsellorService.js';
import { validateCounsellingMessage } from '../src/validators/careerCounsellorValidator.js';

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

test('counsellor prompt explicitly requests the selected response language', () => {
  const context = {
    student: { technicalSkills: [], softSkills: [], careerInterests: [] },
    history: [],
    message: 'Help me choose a career.',
  };

  assert.match(
    buildCounsellorSystemInstruction(LANGUAGES.ENGLISH),
    /Respond in clear, natural English/
  );
  assert.match(
    buildCounsellorSystemInstruction(LANGUAGES.ASSAMESE),
    /natural Assamese/
  );
  assert.match(buildCounsellorSystemInstruction(LANGUAGES.ASSAMESE), /untrusted data/);
  assert.match(
    buildCounsellorPrompt(context),
    /Student's latest message \(untrusted user-provided content\)/
  );
});

test('conversation schema requires paired messages and supported language', async () => {
  const conversation = new CareerCounsellingConversation({
    user: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    title: 'Career advice',
    language: 'French',
    messages: [{ role: 'user', content: 'How do I start?' }],
  });

  await assert.rejects(conversation.validate(), (error) => {
    assert.ok(error.errors.language);
    assert.ok(error.errors.messages);
    return true;
  });
});

test('chat endpoints require authentication', async () => {
  const messageResponse = await fetch(`${baseUrl}/api/v1/ai/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'How do I choose a career?' }),
  });
  const listResponse = await fetch(`${baseUrl}/api/v1/ai/chat/conversations`);
  const historyResponse = await fetch(
    `${baseUrl}/api/v1/ai/chat/conversations/507f1f77bcf86cd799439011`
  );

  assert.equal(messageResponse.status, 401);
  assert.equal(listResponse.status, 401);
  assert.equal(historyResponse.status, 401);
});

test('validates chat message, selected language, and optional conversation ID', async () => {
  const validationApp = express();
  validationApp.use(express.json());
  validationApp.post('/chat/messages', validateCounsellingMessage, (req, res) => res.sendStatus(204));
  const validationServer = validationApp.listen(0);
  await new Promise((resolve, reject) => {
    validationServer.once('listening', resolve);
    validationServer.once('error', reject);
  });

  try {
    const url = `http://127.0.0.1:${validationServer.address().port}/chat/messages`;
    const invalidResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '  ', language: 'French' }),
    });
    const validResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How can I prepare?', language: 'Assamese' }),
    });

    assert.equal(invalidResponse.status, 422);
    assert.equal(validResponse.status, 204);
  } finally {
    await new Promise((resolve, reject) => {
      validationServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
