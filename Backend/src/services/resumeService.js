import path from 'path';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import Student from '../models/Student.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../constants/roles.js';
import { storeResumeFile, removeStoredFile } from './storageService.js';
import { extractResumeText, baselineExtractSections } from './resumeParserService.js';

/**
 * Upload and persist new resume
 * @param {string} userId 
 * @param {object} file - Multer file object
 */
export const uploadResume = async (userId, file) => {
  if (!file) {
    throw ApiError.badRequest('No resume file uploaded. Please attach a PDF or DOCX file.');
  }

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const fileType = ext;

  let extractedText = '';
  try {
    extractedText = await extractResumeText({
      fileType,
      localFilePath: file.path,
      fileUrl: '',
    });
  } catch (parseError) {
    console.warn(`[ResumeParser] Automatic text extraction deferred: ${parseError.message}`);
  }

  // Check if associated student profile exists
  const student = await Student.findOne({ user: userId });

  // Store file (Cloudinary or local storage fallback)
  const storageResult = await storeResumeFile(file);

  // Check existing resumes to determine default primary status
  const existingCount = await Resume.countDocuments({ user: userId });

  const resume = new Resume({
    user: userId,
    student: student ? student._id : undefined,
    fileName: file.originalname,
    storedFileName: file.filename,
    fileType,
    mimeType: file.mimetype,
    fileSize: file.size,
    storageType: storageResult.storageType,
    fileUrl: storageResult.fileUrl,
    cloudinaryPublicId: storageResult.cloudinaryPublicId,
    localFilePath: storageResult.localFilePath,
    isPrimary: existingCount === 0,
    extractedText,
    parsingStatus: extractedText ? 'parsed' : 'pending',
  });
  if (resume.storageType === 'local') {
    resume.fileUrl = `/api/v1/resumes/${resume._id}/download`;
  }

  await resume.save();
  return resume;
};

/**
 * Get all resumes for user (or all resumes if Admin)
 * @param {string} userId 
 * @param {string} userRole 
 * @param {object} query - Query parameters for pagination and filtering
 */
export const getResumes = async (userId, userRole, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Students can only access their own resumes; Admins can filter by user or see all
  const filter = {};
  if (userRole === ROLES.ADMIN) {
    if (query.userId) {
      filter.user = query.userId;
    }
  } else {
    filter.user = userId;
  }

  const total = await Resume.countDocuments(filter);
  const items = await Resume.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email role');

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get resume by ID with ownership verification
 * @param {string} resumeId 
 * @param {object} requestingUser 
 */
export const getResumeById = async (resumeId, requestingUser) => {
  const resume = await Resume.findById(resumeId).populate('user', 'name email role');

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  // Ownership verification
  if (requestingUser.role !== ROLES.ADMIN) {
    const isOwner = resume.user._id.toString() === requestingUser._id.toString();
    if (!isOwner) {
      throw ApiError.forbidden('Access denied. You can only view your own resumes.');
    }
  }

  return resume;
};

/**
 * Retrieve download information for resume
 * @param {string} resumeId 
 * @param {object} requestingUser 
 */
export const downloadResume = async (resumeId, requestingUser) => {
  const resume = await getResumeById(resumeId, requestingUser);

  if (resume.storageType === 'local' && resume.localFilePath) {
    return {
      mode: 'file',
      path: resume.localFilePath,
      fileName: resume.fileName,
      mimeType: resume.mimeType,
    };
  }

  // Cloudinary URL download
  return {
    mode: 'redirect',
    url: resume.fileUrl,
    fileName: resume.fileName,
  };
};

/**
 * Extract plain text from uploaded resume
 * @param {string} resumeId 
 * @param {object} requestingUser 
 */
export const parseResume = async (resumeId, requestingUser) => {
  const resume = await getResumeById(resumeId, requestingUser);

  const text = resume.extractedText || (await extractResumeText(resume));
  if (!resume.extractedText) {
    resume.extractedText = text;
    if (resume.parsingStatus !== 'analyzed') {
      resume.parsingStatus = 'parsed';
    }
    await resume.save();
  }

  return {
    resumeId: resume._id,
    fileName: resume.fileName,
    parsingStatus: resume.parsingStatus,
    charCount: text.length,
    extractedText: text,
  };
};

/**
 * Analyze resume text into structured skills, education, and experience
 * @param {string} resumeId 
 * @param {object} requestingUser 
 */
export const analyzeResume = async (resumeId, requestingUser) => {
  const resume = await getResumeById(resumeId, requestingUser);

  if (!resume.extractedText) {
    resume.extractedText = await extractResumeText(resume);
  }

  // Extract structured sections
  const structuredData = baselineExtractSections(resume.extractedText);

  resume.parsedData = structuredData;
  resume.parsingStatus = 'analyzed';
  await resume.save();

  // If student profile exists, auto-sync newly discovered technical skills
  if (structuredData.technicalSkills && structuredData.technicalSkills.length > 0) {
    const student = await Student.findOne({ user: resume.user._id || resume.user });
    if (student) {
      const existingNames = new Set(student.technicalSkills.map((s) => s.name.toLowerCase()));
      structuredData.technicalSkills.forEach((skillName) => {
        if (!existingNames.has(skillName.toLowerCase())) {
          student.technicalSkills.push({
            name: skillName,
            proficiency: 'Intermediate',
            category: 'Resume Extraction',
          });
          existingNames.add(skillName.toLowerCase());
        }
      });
      await student.save();
    }
  }

  return {
    resumeId: resume._id,
    fileName: resume.fileName,
    parsingStatus: resume.parsingStatus,
    parsedData: resume.parsedData,
  };
};

/**
 * Delete resume and storage resources
 * @param {string} resumeId 
 * @param {object} requestingUser 
 */
export const deleteResume = async (resumeId, requestingUser) => {
  const resume = await getResumeById(resumeId, requestingUser);

  // Remove stored file from storage (Cloudinary or local disk)
  await removeStoredFile(resume);

  await ResumeAnalysis.deleteMany({ resume: resumeId });
  await Resume.findByIdAndDelete(resumeId);

  return true;
};
