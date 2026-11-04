import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { baselineExtractSections } from './resumeParserService.js';

let genAI = null;
const GEMINI_REQUEST_TIMEOUT_MS = 30_000;
const COUNSELLOR_FALLBACK_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

export const getCounsellorModelCandidates = (configuredModel, chatModel) =>
  [...new Set([configuredModel, chatModel, ...COUNSELLOR_FALLBACK_MODELS].filter(Boolean))];

const isRetryableModelError = (error) => {
  const message = typeof error?.message === 'string' ? error.message : '';
  const status = Number(error?.status || error?.statusCode);
  return status === 429 || status === 503 || /\b429\b|\b503\b|high demand|overloaded|too many requests/i.test(message);
};

const requestStructuredJSON = async (prompt, systemInstruction, modelName) => {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      systemInstruction ||
      'You are an expert AI assistant that only outputs valid, parseable JSON.',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const result = await model.generateContent(prompt, {
    timeout: GEMINI_REQUEST_TIMEOUT_MS,
  });
  const response = await result.response;
  return parseCleanJSON(response.text());
};

export const getStructuredAIErrorMessage = (error) => {
  const message = typeof error?.message === 'string' ? error.message : '';
  const status = Number(error?.status || error?.statusCode);

  if (status === 429 || /\b429\b|quota exceeded|too many requests/i.test(message)) {
    return 'Gemini AI quota or rate limit reached. Wait for the limit to reset or increase the project quota, then try again.';
  }
  if (status === 503 || /\b503\b|service unavailable|high demand|overloaded/i.test(message)) {
    return 'Gemini AI is temporarily overloaded. Please try again in a few minutes.';
  }
  if (status === 401 || status === 403 || /\b401\b|\b403\b|api key/i.test(message)) {
    return 'Gemini AI authorization failed. Check the server API-key configuration.';
  }
  if (/json|parse/i.test(message)) {
    return 'Gemini AI returned invalid structured content. Please try again.';
  }
  return 'Gemini AI could not complete the request. Please try again later.';
};

if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY !== 'dummy_gemini_api_key_placeholder') {
  genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  console.log('[Gemini AI] Google Gemini AI client initialized successfully');
} else {
  console.log('[Gemini AI] GEMINI_API_KEY not configured or placeholder detected. Operating in intelligent fallback mode.');
}

/**
 * Clean and parse raw JSON string from LLM response
 * @param {string} rawText 
 * @returns {object|array}
 */
const parseCleanJSON = (rawText) => {
  if (!rawText) return {};

  let cleaned = rawText.trim();
  // Strip markdown code fences if model returned ```json ... ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  try {
    return JSON.parse(cleaned.trim());
  } catch (err) {
    // Attempt regex extraction of first {...} or [...] block
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse AI output into valid JSON: ${err.message}`);
  }
};

export const readGeneratedText = (response) => {
  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === 'MAX_TOKENS') {
    throw ApiError.serviceUnavailable(
      'The AI response was cut off before it completed. Please send your question again.'
    );
  }

  const text = response.text()?.trim();
  if (!text) {
    throw new Error(`Gemini returned no complete text (finish reason: ${finishReason || 'unknown'}).`);
  }

  return text.slice(0, 8000);
};

/**
 * Call Gemini AI model to generate structured JSON content
 * @param {string} prompt 
 * @param {string} systemInstruction 
 * @returns {Promise<object>}
 */
export const generateStructuredJSON = async (prompt, systemInstruction = '') => {
  if (!genAI) {
    return null; // Signals fallback should be used
  }

  try {
    return await requestStructuredJSON(prompt, systemInstruction, ENV.GEMINI_CHAT_MODEL);
  } catch (error) {
    console.error(`[Gemini AI] Execution error: ${error.message}`);
    // If quota or API failure occurs, return null to gracefully trigger fallback
    return null;
  }
};

export const generateStructuredJSONWithFallback = async (
  prompt,
  systemInstruction = '',
  fallbackModels = [],
  validateResponse = () => true
) => {
  if (!genAI) {
    throw ApiError.serviceUnavailable(
      'Gemini AI is not configured. Add a valid server API key before generating AI content.'
    );
  }

  const modelNames = [...new Set([ENV.GEMINI_CHAT_MODEL, ...fallbackModels].filter(Boolean))];
  let lastError;
  let lastResponse;

  for (let index = 0; index < modelNames.length; index += 1) {
    try {
      const response = await requestStructuredJSON(prompt, systemInstruction, modelNames[index]);
      lastResponse = response;
      if (validateResponse(response)) return response;
      console.error(
        `[Gemini AI] Structured generation attempt ${index + 1}/${modelNames.length} returned invalid content`
      );
    } catch (error) {
      lastError = error;
      console.error(
        `[Gemini AI] Structured generation attempt ${index + 1}/${modelNames.length} failed: ${error.message}`
      );
    }
  }

  if (lastResponse !== undefined) return lastResponse;
  throw ApiError.serviceUnavailable(getStructuredAIErrorMessage(lastError));
};

export const getResumeIntelligenceModelFallbacks = (counsellorModel) =>
  [...new Set([counsellorModel, 'gemini-3.5-flash-lite'].filter(Boolean))];

/**
 * Generate a plain-text response using the configured Gemini client.
 * Unlike structured-generation callers, chat cannot return a useful fallback
 * response when the AI provider is unavailable.
 * @param {string} prompt
 * @param {string} systemInstruction
 * @returns {Promise<string>}
 */
export const generateTextResponse = async (prompt, systemInstruction = '') => {
  if (!genAI) {
    throw ApiError.serviceUnavailable(
      'Career counsellor AI is not configured. Please try again later.'
    );
  }

  const modelNames = getCounsellorModelCandidates(
    ENV.GEMINI_COUNSELLOR_MODEL,
    ENV.GEMINI_CHAT_MODEL
  );
  let lastError;

  for (let index = 0; index < modelNames.length; index += 1) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelNames[index],
        systemInstruction:
          systemInstruction || 'You are a helpful AI assistant. Respond in plain text.',
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.4,
        },
      });
      const result = await model.generateContent(prompt, {
        timeout: GEMINI_REQUEST_TIMEOUT_MS,
      });
      return readGeneratedText(result.response);
    } catch (error) {
      lastError = error;
      console.error(
        `[Gemini AI] Career counsellor model ${modelNames[index]} failed: ${error.message}`
      );
      if (error instanceof ApiError || !isRetryableModelError(error)) break;
    }
  }

  if (lastError instanceof ApiError) throw lastError;
  throw ApiError.serviceUnavailable(getStructuredAIErrorMessage(lastError));
};

/**
 * Extract structured resume sections and skills using Gemini AI
 * @param {string} resumeText 
 * @returns {Promise<object>}
 */
export const extractSkillsAndSectionsAI = async (resumeText) => {
  if (!resumeText || resumeText.trim().length === 0) {
    throw ApiError.badRequest('Resume text is empty or missing');
  }

  const prompt = `
Analyze the following resume/curriculum vitae text and extract all relevant structured sections.
Return a single JSON object with the following schema:
{
  "technicalSkills": ["string"],
  "programmingLanguages": ["string"],
  "frameworks": ["string"],
  "databases": ["string"],
  "softSkills": ["string"],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startYear": "string",
      "endYear": "string",
      "score": "string"
    }
  ],
  "workExperience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ]
}

Only include items explicitly mentioned in the text.
Resume text:
"""
${resumeText.slice(0, 15000)}
"""
`;

  const aiResult = await generateStructuredJSON(
    prompt,
    'You are a professional technical recruiter and resume parsing engine. Always return valid JSON conforming to the requested schema.'
  );

  // Fallback to baseline rule-based parser if AI was unconfigured or encountered an error
  if (!aiResult) {
    return baselineExtractSections(resumeText);
  }

  // Validate and sanitize AI response structure
  return {
    technicalSkills: Array.isArray(aiResult.technicalSkills) ? aiResult.technicalSkills : [],
    programmingLanguages: Array.isArray(aiResult.programmingLanguages) ? aiResult.programmingLanguages : [],
    frameworks: Array.isArray(aiResult.frameworks) ? aiResult.frameworks : [],
    databases: Array.isArray(aiResult.databases) ? aiResult.databases : [],
    softSkills: Array.isArray(aiResult.softSkills) ? aiResult.softSkills : [],
    education: Array.isArray(aiResult.education) ? aiResult.education : [],
    workExperience: Array.isArray(aiResult.workExperience) ? aiResult.workExperience : [],
    projects: Array.isArray(aiResult.projects) ? aiResult.projects : [],
    certifications: Array.isArray(aiResult.certifications) ? aiResult.certifications : [],
  };
};

/**
 * Classify a list of skills into standardized categories and demand levels
 * @param {Array<string>} skills 
 * @returns {Promise<Array<object>>}
 */
export const classifySkillsAI = async (skills) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    throw ApiError.badRequest('Skills array must not be empty');
  }

  const prompt = `
Classify the following technical and soft skills for university placements.
For each skill, provide:
- "name": skill name
- "category": one of ["Programming Language", "Framework/Library", "Database", "Cloud & DevOps", "Tool", "Soft Skill", "Core CS", "Other"]
- "demandLevel": one of ["High", "Medium", "Low"]
- "description": one short sentence explaining its industry use
- "suggestedProficiency": one of ["Beginner", "Intermediate", "Advanced"]

Return a single JSON array of objects.
Skills: ${JSON.stringify(skills.slice(0, 50))}
`;

  const aiResult = await generateStructuredJSON(
    prompt,
    'You are a tech industry career advisor and taxonomy specialist.'
  );

  if (Array.isArray(aiResult) && aiResult.length > 0) {
    return aiResult;
  }

  // Intelligent fallback classification when AI is offline or quota reached
  const categoryMap = {
    javascript: 'Programming Language',
    typescript: 'Programming Language',
    python: 'Programming Language',
    java: 'Programming Language',
    'c++': 'Programming Language',
    c: 'Programming Language',
    sql: 'Database',
    mongodb: 'Database',
    postgresql: 'Database',
    mysql: 'Database',
    react: 'Framework/Library',
    'node.js': 'Framework/Library',
    express: 'Framework/Library',
    docker: 'Cloud & DevOps',
    aws: 'Cloud & DevOps',
    git: 'Tool',
    communication: 'Soft Skill',
    teamwork: 'Soft Skill',
    'problem solving': 'Soft Skill',
  };

  return skills.map((skill) => {
    const key = skill.toLowerCase().trim();
    const category = categoryMap[key] || 'Other';
    const isSoft = category === 'Soft Skill';

    return {
      name: skill,
      category,
      demandLevel: 'High',
      description: `${skill} is a recognized ${category.toLowerCase()} valuable in modern tech roles.`,
      suggestedProficiency: isSoft ? 'Advanced' : 'Intermediate',
    };
  });
};
