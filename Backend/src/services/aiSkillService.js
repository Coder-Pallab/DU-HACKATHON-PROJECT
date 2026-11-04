import Student from '../models/Student.js';
import Resume from '../models/Resume.js';
import Skill from '../models/Skill.js';
import { ApiError } from '../utils/apiError.js';
import { extractSkillsAndSectionsAI, classifySkillsAI } from './geminiService.js';
import { extractResumeText } from './resumeParserService.js';
import { getMyProfile } from './studentService.js';

/**
 * Extract skills and resume sections from plain text or a stored resume ID
 * @param {object} params - { text, resumeId, user }
 */
export const extractSkills = async ({ text, resumeId, user }) => {
  let contentToAnalyze = text;

  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw ApiError.notFound('Resume not found');
    }

    if (user.role !== 'Admin' && resume.user.toString() !== user._id.toString()) {
      throw ApiError.forbidden('You do not have permission to analyze this resume');
    }

    if (!resume.extractedText) {
      resume.extractedText = await extractResumeText(resume);
      await resume.save();
    }
    contentToAnalyze = resume.extractedText;
  }

  if (!contentToAnalyze || contentToAnalyze.trim().length === 0) {
    throw ApiError.badRequest('Provide either "text" in the request body or a valid "resumeId"');
  }

  const extractedData = await extractSkillsAndSectionsAI(contentToAnalyze);
  return extractedData;
};

/**
 * Classify a list of skills into categories and persist in Skill catalog
 * @param {Array<string>} skills 
 */
export const classifySkills = async (skills) => {
  const classifications = await classifySkillsAI(skills);

  // Asynchronously register/upsert skills in Skill catalog
  for (const item of classifications) {
    try {
      await Skill.findOneAndUpdate(
        { name: new RegExp(`^${item.name.trim()}$`, 'i') },
        {
          $setOnInsert: {
            name: item.name.trim(),
            category: item.category || 'Other',
            description: item.description || '',
            demandLevel: item.demandLevel || 'High',
          },
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      // Ignore duplicate key collision during concurrent upserts
    }
  }

  return classifications;
};

/**
 * Get all skills for currently logged-in student (auto-provisions profile if not yet created)
 * @param {string} userId 
 */
export const getStudentSkills = async (userId) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  return {
    technicalSkills: student.technicalSkills || [],
    softSkills: student.softSkills || [],
    totalTechnicalSkills: (student.technicalSkills || []).length,
    totalSoftSkills: (student.softSkills || []).length,
  };
};

/**
 * Manually add a skill to student's profile
 * @param {string} userId 
 * @param {object} skillData - { name, proficiency, category, isSoftSkill }
 */
export const addStudentSkill = async (userId, skillData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  const { name, proficiency = 'Intermediate', category = 'Technical', isSoftSkill = false } = skillData;

  if (isSoftSkill) {
    const exists = (student.softSkills || []).some((s) => s.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw ApiError.conflict(`Soft skill '${name}' already exists in your profile`);
    }
    student.softSkills = student.softSkills || [];
    student.softSkills.push(name.trim());
    await student.save();
    return { type: 'softSkill', name: name.trim() };
  }

  // Technical skill
  student.technicalSkills = student.technicalSkills || [];
  const exists = student.technicalSkills.some(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    throw ApiError.conflict(`Technical skill '${name}' already exists in your profile`);
  }

  const newSkill = {
    name: name.trim(),
    proficiency,
    category,
  };

  student.technicalSkills.push(newSkill);
  await student.save();

  // Return the newly added subdocument
  const added = student.technicalSkills[student.technicalSkills.length - 1];
  return added;
};

/**
 * Manually update an existing technical skill in student profile
 * @param {string} userId 
 * @param {string} skillId 
 * @param {object} updateData 
 */
export const updateStudentSkill = async (userId, skillId, updateData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  const skillSubdoc = student.technicalSkills ? student.technicalSkills.id(skillId) : null;
  if (!skillSubdoc) {
    throw ApiError.notFound('Skill not found in your student profile');
  }

  if (updateData.name) skillSubdoc.name = updateData.name.trim();
  if (updateData.proficiency) skillSubdoc.proficiency = updateData.proficiency;
  if (updateData.category) skillSubdoc.category = updateData.category;

  await student.save();
  return skillSubdoc;
};

/**
 * Manually remove a skill from student profile
 * @param {string} userId 
 * @param {string} skillId 
 */
export const deleteStudentSkill = async (userId, skillId) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  const skillSubdoc = student.technicalSkills ? student.technicalSkills.id(skillId) : null;
  if (!skillSubdoc) {
    // Check if skillId is a soft skill string
    const softIndex = (student.softSkills || []).indexOf(skillId);
    if (softIndex !== -1) {
      student.softSkills.splice(softIndex, 1);
      await student.save();
      return true;
    }
    throw ApiError.notFound('Skill not found in your profile');
  }

  student.technicalSkills.pull({ _id: skillId });
  await student.save();

  return true;
};
