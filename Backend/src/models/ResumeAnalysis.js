import mongoose from 'mongoose';

const scoreCategorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, default: null },
    status: { type: String, enum: ['assessed', 'unknown'], required: true },
    rationale: { type: String, required: true, maxlength: 1200 },
    evidence: { type: [String], default: [] },
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1000 },
    evidence: { type: String, default: '', maxlength: 1000 },
  },
  { _id: false }
);

const improvementDraftSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true },
    sourceText: { type: String, default: '', maxlength: 3000 },
    generatedContent: { type: String, required: true, maxlength: 4000 },
    editedContent: { type: String, default: '', maxlength: 4000 },
    evidence: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'accepted', 'dismissed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

const compatibilitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['career', 'job_description'], required: true },
    targetTitle: { type: String, required: true, maxlength: 200 },
    keywordMatchScore: { type: Number, min: 0, max: 100, default: null },
    careerSuitabilityScore: { type: Number, min: 0, max: 100, default: null },
    matchingSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    relevantProjects: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    jobDescription: { type: String, default: '', maxlength: 20000 },
    matchingMethod: { type: String, required: true },
    disclaimer: { type: String, required: true },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    language: { type: String, enum: ['English', 'Assamese'], required: true },
    analysisType: {
      type: String,
      enum: ['resume_review', 'compatibility'],
      default: 'resume_review',
      required: true,
    },
    career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', default: null },
    careerTitle: { type: String, default: '', maxlength: 200 },
    overallScore: { type: Number, min: 0, max: 100, default: null },
    analysisStatus: {
      type: String,
      enum: ['assessed', 'insufficient_data'],
      required: true,
    },
    categoryScores: { type: [scoreCategorySchema], default: [] },
    strengths: { type: [recommendationSchema], default: [] },
    weaknesses: { type: [recommendationSchema], default: [] },
    missingSections: { type: [recommendationSchema], default: [] },
    recommendations: { type: [recommendationSchema], default: [] },
    compatibility: { type: compatibilitySchema, default: null },
    improvementDrafts: { type: [improvementDraftSchema], default: [] },
    rubric: {
      type: String,
      required: true,
      default: 'Five-level evidence rubric: 0 absent, 25 weak, 50 basic, 75 clear, 100 strong and relevant. Unknown categories are excluded from the overall score.',
    },
    disclaimer: { type: String, required: true },
    sourceUpdatedAt: { type: Date, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

resumeAnalysisSchema.index({ user: 1, resume: 1, createdAt: -1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
