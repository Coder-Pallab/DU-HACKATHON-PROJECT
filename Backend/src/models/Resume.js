import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    storageType: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'local',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    localFilePath: {
      type: String,
      default: '',
    },
    extractedText: {
      type: String,
      default: '',
    },
    parsedData: {
      technicalSkills: { type: [String], default: [] },
      programmingLanguages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      databases: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
      education: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startYear: String,
          endYear: String,
          score: String,
        },
      ],
      workExperience: [
        {
          title: String,
          company: String,
          location: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          link: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          year: String,
        },
      ],
    },
    parsingStatus: {
      type: String,
      enum: ['pending', 'parsed', 'analyzed', 'failed'],
      default: 'pending',
    },
    isPrimary: {
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

// Fast compound indexing for user resumes
resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;

