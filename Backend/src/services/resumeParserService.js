import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { ApiError } from '../utils/apiError.js';

/**
 * Fetch buffer from local file or remote URL
 * @param {string} localFilePath 
 * @param {string} remoteUrl 
 * @returns {Promise<Buffer>}
 */
const getFileBuffer = async (localFilePath, remoteUrl) => {
  if (localFilePath && fs.existsSync(localFilePath)) {
    return fs.readFileSync(localFilePath);
  }

  if (remoteUrl && remoteUrl.startsWith('http')) {
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`Failed to download remote resume from ${remoteUrl}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  throw ApiError.notFound('Resume file cannot be located on disk or cloud storage');
};

/**
 * Extract raw plain text from PDF or DOCX file
 * @param {object} resume - Resume model document
 * @returns {Promise<string>} Cleaned extracted text
 */
export const extractResumeText = async (resume) => {
  const buffer = await getFileBuffer(resume.localFilePath, resume.fileUrl);

  let rawText = '';

  if (resume.fileType === 'pdf') {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    rawText = result.text || '';
    await parser.destroy?.();
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

