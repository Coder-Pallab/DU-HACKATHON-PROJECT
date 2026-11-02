import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import app from '../src/app.js';
import { assertRuntimeConfig } from '../src/config/env.js';
import { isAllowedResumeFile } from '../src/middleware/uploadMiddleware.js';
import {
  downloadCloudinaryResume,
  extractResumeText,
} from '../src/services/resumeParserService.js';
import { isCloudinaryConfigured } from '../src/config/cloudinary.js';
import { validateRegister } from '../src/validators/authValidator.js';

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

test('public registration rejects privileged roles and accepts student role', async () => {
  const validationApp = express();
  validationApp.use(express.json());
  validationApp.post('/register', validateRegister, (req, res) => res.sendStatus(204));
  const validationServer = validationApp.listen(0);
  await new Promise((resolve, reject) => {
    validationServer.once('listening', resolve);
    validationServer.once('error', reject);
  });

  try {
    const url = `http://127.0.0.1:${validationServer.address().port}/register`;
    const baseRequest = {
      name: 'Test Student',
      email: 'student@example.com',
      password: 'securepass123',
    };
    const privilegedResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...baseRequest, role: 'Admin' }),
    });
    const studentResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...baseRequest, role: 'Student' }),
    });

    assert.equal(privilegedResponse.status, 422);
    assert.equal(studentResponse.status, 204);
  } finally {
    await new Promise((resolve, reject) => {
      validationServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('resume uploads accept PDF and DOCX but reject legacy DOC files', () => {
  assert.equal(
    isAllowedResumeFile({ originalname: 'resume.pdf', mimetype: 'application/pdf' }),
    true
  );
  assert.equal(
    isAllowedResumeFile({
      originalname: 'resume.docx',
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
    true
  );
  assert.equal(
    isAllowedResumeFile({ originalname: 'resume.doc', mimetype: 'application/msword' }),
    false
  );
});

test('resume parser falls back to Cloudinary authenticated download after delivery denial', async () => {
  const resumeUrl = 'https://res.cloudinary.com/example/raw/upload/private-resume.pdf';
  const originalFetch = globalThis.fetch;
  let downloadAttempts = 0;
  globalThis.fetch = async (url) => {
    downloadAttempts += 1;
    if (new URL(url).hostname === 'res.cloudinary.com') {
      return new Response(null, { status: 401 });
    }

    return new Response('resume bytes', { status: 200 });
  };

  try {
    await assert.rejects(
      extractResumeText({
        fileType: 'pdf',
        localFilePath: '',
        fileUrl: resumeUrl,
        cloudinaryPublicId: 'private-resume',
      }),
      (error) => {
        assert.equal(error.statusCode === 503, !isCloudinaryConfigured);
        return true;
      }
    );
    assert.equal(downloadAttempts, isCloudinaryConfigured ? 2 : 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Cloudinary authenticated download signs the asset and returns its bytes', async (context) => {
  if (!isCloudinaryConfigured) {
    context.skip('Cloudinary credentials are not configured');
  }

  const originalFetch = globalThis.fetch;
  let requestedUrl;
  globalThis.fetch = async (url) => {
    requestedUrl = new URL(url);
    return new Response('resume bytes', { status: 200 });
  };

  try {
    const buffer = await downloadCloudinaryResume('private-folder/resume.pdf', 'pdf');
    assert.equal(requestedUrl.hostname, 'api.cloudinary.com');
    assert.match(requestedUrl.pathname, /^\/v1_1\/[^/]+\/raw\/download$/);
    assert.equal(buffer.toString(), 'resume bytes');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('local upload directory is not exposed as a public static route', async () => {
  const response = await fetch(`${baseUrl}/uploads/private-resume.pdf`);
  assert.equal(response.status, 404);
});

test('database-backed routes fail quickly with 503 when MongoDB is disconnected', async () => {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'securepass123',
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.success, false);
  assert.match(body.message, /Database is unavailable/);
  assert.ok(Date.now() - startedAt < 1000, 'request should not wait for Mongoose buffering');
});

test('health endpoint reports MongoDB outage as service unavailable', async () => {
  const response = await fetch(`${baseUrl}/api/v1/health`);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.success, false);
  assert.equal(body.data.status, 'degraded');
  assert.equal(body.data.services.database.isConnected, false);
});

test('production runtime requires strong, distinct JWT secrets', () => {
  assert.throws(
    () => assertRuntimeConfig({ NODE_ENV: 'production', JWT_ACCESS_SECRET: '', JWT_REFRESH_SECRET: '' }),
    /at least 32 characters/
  );
  assert.throws(
    () =>
      assertRuntimeConfig({
        NODE_ENV: 'production',
        JWT_ACCESS_SECRET: 'dev_access_secret_ai_career_guidance_2026',
        JWT_REFRESH_SECRET: 'secure-refresh-secret-that-is-long-enough',
      }),
    /non-default/
  );
  assert.throws(
    () =>
      assertRuntimeConfig({
        NODE_ENV: 'production',
        JWT_ACCESS_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'a'.repeat(32),
      }),
    /must be different/
  );
  assert.doesNotThrow(() =>
    assertRuntimeConfig({
      NODE_ENV: 'production',
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
    })
  );
});
