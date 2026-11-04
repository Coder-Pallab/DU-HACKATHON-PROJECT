import Student from '../models/Student.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../constants/roles.js';

/**
 * Normalize skill inputs so both string arrays and object arrays are accepted
 * @param {Array} skills 
 * @returns {Array} normalized skills objects
 */
const normalizeTechnicalSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.map((skill) => {
    if (typeof skill === 'string') {
      return { name: skill.trim(), proficiency: 'Intermediate', category: 'Technical' };
    }
    if (typeof skill === 'object' && skill !== null && skill.name) {
      return {
        name: skill.name.trim(),
        proficiency: skill.proficiency || 'Intermediate',
        category: skill.category || 'Technical',
      };
    }
    return null;
  }).filter(Boolean);
};

/**
 * Get student profile by associated User ID
 * @param {string} userId 
 */
export const getMyProfile = async (userId) => {
  let student = await Student.findOne({ user: userId }).populate('user', 'name email role avatar phone');

  // Auto-provision initial profile if student logs in for the first time
  if (!student) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    student = await Student.create({
      user: user._id,
      fullName: user.name,
      phoneNumber: user.phone || '',
    });

    student = await student.populate('user', 'name email role avatar phone');
  }

  return student;
};

/**
 * Get student profile by Student ID or User ID with RBAC and ownership checks
 * @param {string} studentOrUserId 
 * @param {object} requestingUser 
 */
export const getStudentById = async (studentOrUserId, requestingUser) => {
  // Check if query matches Student _id or user _id
  let student = await Student.findById(studentOrUserId).populate('user', 'name email role avatar phone');
  if (!student) {
    student = await Student.findOne({ user: studentOrUserId }).populate('user', 'name email role avatar phone');
  }

  if (!student) {
    throw ApiError.notFound('Student profile not found');
  }

  // Ownership verification: Students can only view their own profile; Admins & Recruiters can view all
  if (requestingUser.role === ROLES.STUDENT) {
    const isOwner = student.user._id.toString() === requestingUser._id.toString();
    if (!isOwner) {
      throw ApiError.forbidden('Access denied. You can only view your own student profile.');
    }
  }

  return student;
};

/**
 * Create student profile manually
 * @param {string} userId 
 * @param {object} data 
 */
export const createProfile = async (userId, data) => {
  const existingProfile = await Student.findOne({ user: userId });
  if (existingProfile) {
    throw ApiError.conflict('Student profile already exists. Use PATCH endpoints to update.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('Associated user not found');
  }

  const newStudent = new Student({
    user: userId,
    fullName: data.fullName || user.name,
    phoneNumber: data.phoneNumber || user.phone || '',
    college: data.college || '',
    university: data.university || '',
    degree: data.degree || '',
    department: data.department || '',
    semester: data.semester || 1,
    graduationYear: data.graduationYear || undefined,
    cgpa: data.cgpa || 0,
    technicalSkills: normalizeTechnicalSkills(data.technicalSkills),
    softSkills: data.softSkills || [],
    careerInterests: data.careerInterests || [],
    preferredLanguage: data.preferredLanguage || undefined,
    bio: data.bio || '',
    socialLinks: data.socialLinks || {},
  });

  await newStudent.save();
  return newStudent.populate('user', 'name email role avatar phone');
};

/**
 * Update general profile information (auto-provisions if first access)
 * @param {string} userId 
 * @param {object} updateData 
 */
export const updateProfile = async (userId, updateData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  if (updateData.fullName !== undefined) student.fullName = updateData.fullName;
  if (updateData.phoneNumber !== undefined) student.phoneNumber = updateData.phoneNumber;
  if (updateData.bio !== undefined) student.bio = updateData.bio;
  if (updateData.socialLinks !== undefined) {
    student.socialLinks = {
      ...student.socialLinks,
      ...updateData.socialLinks,
    };
  }

  await student.save();

  // Keep User name and phone in sync
  if (updateData.fullName || updateData.phoneNumber) {
    await User.findByIdAndUpdate(userId, {
      ...(updateData.fullName && { name: updateData.fullName }),
      ...(updateData.phoneNumber && { phone: updateData.phoneNumber }),
    });
  }

  return student.populate('user', 'name email role avatar phone');
};

/**
 * Update academic details (auto-provisions if first access)
 * @param {string} userId 
 * @param {object} academicData 
 */
export const updateAcademicDetails = async (userId, academicData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  const fields = ['college', 'university', 'degree', 'department', 'semester', 'graduationYear', 'cgpa'];
  fields.forEach((field) => {
    if (academicData[field] !== undefined) {
      student[field] = academicData[field];
    }
  });

  await student.save();
  return student.populate('user', 'name email role avatar phone');
};

/**
 * Update technical skills, soft skills, and career interests (auto-provisions if first access)
 * @param {string} userId 
 * @param {object} interestsData 
 */
export const updateInterests = async (userId, interestsData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  if (interestsData.technicalSkills !== undefined) {
    student.technicalSkills = normalizeTechnicalSkills(interestsData.technicalSkills);
  }

  if (interestsData.softSkills !== undefined) {
    student.softSkills = Array.isArray(interestsData.softSkills)
      ? interestsData.softSkills.map((s) => s.trim()).filter(Boolean)
      : [];
  }

  if (interestsData.careerInterests !== undefined) {
    student.careerInterests = Array.isArray(interestsData.careerInterests)
      ? interestsData.careerInterests.map((c) => c.trim()).filter(Boolean)
      : [];
  }

  await student.save();
  return student.populate('user', 'name email role avatar phone');
};

/**
 * Update preferred language and preferences (auto-provisions if first access)
 * @param {string} userId 
 * @param {object} preferencesData 
 */
export const updatePreferences = async (userId, preferencesData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await getMyProfile(userId);
  }

  if (preferencesData.preferredLanguage) {
    student.preferredLanguage = preferencesData.preferredLanguage;
  }

  await student.save();
  return student.populate('user', 'name email role avatar phone');
};
