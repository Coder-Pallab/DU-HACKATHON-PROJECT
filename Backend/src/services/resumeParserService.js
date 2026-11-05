import fs from 'fs';
import { createRequire } from 'node:module';
import mammoth from 'mammoth';
import { ENV } from '../config/env.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';

const pdfParse = createRequire(import.meta.url)('pdf-parse');

const readRemoteResponse = async (response) => {
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > ENV.MAX_FILE_SIZE_BYTES) {
    await response.body?.cancel();
    throw ApiError.badRequest('Stored resume exceeds the maximum supported file size.');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > ENV.MAX_FILE_SIZE_BYTES) {
    throw ApiError.badRequest('Stored resume exceeds the maximum supported file size.');
  }
  return buffer;
};

export const downloadCloudinaryResume = async (publicId, fileType) => {
  if (!isCloudinaryConfigured || !publicId || !['pdf', 'docx'].includes(fileType)) {
    throw ApiError.serviceUnavailable(
      'Cloudinary could not provide this resume. Check its delivery permissions or re-upload it.'
    );
  }

  const downloadUrl = cloudinary.utils.private_download_url(publicId, fileType, {
    resource_type: 'raw',
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 300,
    attachment: false,
  });

  let response;
  try {
    response = await fetch(downloadUrl, { signal: AbortSignal.timeout(15000) });
  } catch {
    throw ApiError.serviceUnavailable(
      'Could not reach Cloudinary authenticated download. Check Cloudinary availability and try again.'
    );
  }

  if (!response.ok) {
    await response.body?.cancel();
    throw ApiError.serviceUnavailable(
      `Cloudinary authenticated download failed with HTTP ${response.status}. Check the Cloudinary credentials and resume asset.`,
      [{ provider: 'Cloudinary', status: response.status }]
    );
  }

  return readRemoteResponse(response);
};

/**
 * Fetch buffer from local file or remote URL
 * @param {object} resume
 * @returns {Promise<Buffer>}
 */
const getFileBuffer = async (resume) => {
  if (resume.localFilePath && fs.existsSync(resume.localFilePath)) {
    return fs.readFileSync(resume.localFilePath);
  }

  if (resume.fileUrl && resume.fileUrl.startsWith('http')) {
    let response;
    try {
      response = await fetch(resume.fileUrl, { signal: AbortSignal.timeout(15000) });
    } catch {
      throw ApiError.serviceUnavailable(
        'Could not reach remote resume storage. Check Cloudinary availability and try again.'
      );
    }

    if (!response.ok) {
      const remoteHost = new URL(resume.fileUrl).hostname;
      const isCloudinary = remoteHost === 'res.cloudinary.com' || remoteHost.endsWith('.cloudinary.com');
      await response.body?.cancel();

      if (isCloudinary && [401, 403].includes(response.status)) {
        return downloadCloudinaryResume(resume.cloudinaryPublicId, resume.fileType);
      }

      if (response.status === 404) {
        throw ApiError.notFound('The stored resume file could not be found in remote storage.');
      }

      throw ApiError.serviceUnavailable(
        `Remote resume storage returned HTTP ${response.status}. Try again later or re-upload the resume.`,
        [{ status: response.status }]
      );
    }

    return readRemoteResponse(response);
  }

  throw ApiError.notFound('Resume file cannot be located on disk or cloud storage');
};

/**
 * Extract raw plain text from PDF or DOCX file
 * @param {object} resume - Resume model document
 * @returns {Promise<string>} Cleaned extracted text
 */
export const extractResumeText = async (resume) => {
  const buffer = await getFileBuffer(resume);

  let rawText = '';

  if (resume.fileType === 'pdf') {
    const result = await pdfParse(buffer);
    rawText = result.text || '';
  } else if (resume.fileType === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value || '';
  } else {
    throw ApiError.badRequest(`Unsupported resume file format: ${resume.fileType}`);
  }

  // Clean whitespace and normalize line endings
  const cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleanedText;
};

/**
 * Baseline Rule-Based Skill & Section Extraction
 * (Ensures structured JSON data is extracted even before Gemini AI is called or if offline)
 * @param {string} text - Cleaned extracted text
 * @returns {object} Structured resume data
 */
export const baselineExtractSections = (text) => {
  const lower = text.toLowerCase();

  // Known skill dictionaries
  const knownLanguages = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'golang', 'rust',
    'php', 'ruby', 'kotlin', 'swift', 'dart', 'html', 'css', 'sql', 'r'
  ];

  const knownFrameworks = [
    'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'django', 'flask',
    'spring boot', 'fastapi', 'laravel', 'asp.net', 'tailwind', 'bootstrap', 'react native', 'flutter'
  ];

  const knownDatabases = [
    'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'firebase', 'cassandra', 'dynamodb', 'oracle'
  ];

  const knownSoftSkills = [
    'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
    'adaptability', 'time management', 'collaboration', 'creativity', 'work ethic'
  ];

  const foundLanguages = knownLanguages.filter((lang) => {
    const regex = new RegExp(`\\b${lang.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    return regex.test(lower);
  });

  const foundFrameworks = knownFrameworks.filter((fw) => {
    const regex = new RegExp(`\\b${fw.replace('.', '\\.')}\\b`, 'i');
    return regex.test(lower);
  });

  const foundDatabases = knownDatabases.filter((db) => {
    const regex = new RegExp(`\\b${db}\\b`, 'i');
    return regex.test(lower);
  });

  const foundSoftSkills = knownSoftSkills.filter((sk) => {
    return lower.includes(sk);
  });

  const allTechnicalSkills = Array.from(new Set([...foundLanguages, ...foundFrameworks, ...foundDatabases]));

  return {
    technicalSkills: allTechnicalSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    programmingLanguages: foundLanguages.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    frameworks: foundFrameworks.map((f) => f.charAt(0).toUpperCase() + f.slice(1)),
    databases: foundDatabases.map((d) => d.charAt(0).toUpperCase() + d.slice(1)),
    softSkills: foundSoftSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    education: [],
    workExperience: [],
    projects: [],
    certifications: [],
  };
};
