import mongoose from 'mongoose';
import { LANGUAGES, ALL_LANGUAGES } from '../constants/languages.js';

const technicalSkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    proficiency: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        message: 'Proficiency must be Beginner, Intermediate, Advanced, or Expert',
      },
      default: 'Intermediate',
    },
    category: {
      type: String,
      trim: true,
      default: 'Technical',
    },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    degree: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
      max: [12, 'Semester cannot exceed 12'],
      default: 1,
    },
    graduationYear: {
      type: Number,
      min: [2000, 'Graduation year must be valid'],
      max: [2100, 'Graduation year must be valid'],
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 0,
    },
    technicalSkills: [technicalSkillSchema],
    softSkills: {
      type: [String],
      default: [],
    },
    careerInterests: {
      type: [String],
      default: [],
    },
    preferredLanguage: {
      type: String,
      enum: {
        values: ALL_LANGUAGES,
        message: `Preferred language must be one of: ${ALL_LANGUAGES.join(', ')}`,
      },
      default: LANGUAGES.ENGLISH,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    socialLinks: {
      github: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for fast search by college, degree, graduation year, and language
studentSchema.index({ college: 1, degree: 1, graduationYear: 1 });
studentSchema.index({ 'technicalSkills.name': 1 });

/**
 * Pre-save hook: auto-compute profile completeness
 */
studentSchema.pre('save', function () {
  const hasAcademic = !!(this.college && this.degree && this.department && this.graduationYear);
  const hasSkills = this.technicalSkills && this.technicalSkills.length > 0;
  const hasInterests = this.careerInterests && this.careerInterests.length > 0;

  this.isProfileComplete = Boolean(this.fullName && hasAcademic && hasSkills && hasInterests);
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

