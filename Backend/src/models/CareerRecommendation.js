import mongoose from 'mongoose';

const recommendationItemSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    careerTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      default: '',
    },
    careerDescription: {
      type: String,
      default: '',
    },
    careerFitSummary: {
      type: String,
      default: '',
    },
    localizedCareerTitle: { type: String, default: '' },
    localizedSector: { type: String, default: '' },
    localizedCareerDescription: { type: String, default: '' },
    localizedCareerFitSummary: { type: String, default: '' },
    localizedRequiredQualifications: { type: [String], default: [] },
    localizedSuggestedNextSteps: { type: [String], default: [] },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    requiredQualifications: {
      type: [String],
      default: [],
    },
    suggestedNextSteps: {
      type: [String],
      default: [],
    },
    scoreBreakdown: {
      technicalScore: { type: Number, default: 0 },
      softSkillScore: { type: Number, default: 0 },
      interestAlignmentScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
    },
  },
  { _id: true }
);

const careerRecommendationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recommendations: [recommendationItemSchema],
    contentLanguage: {
      type: String,
      enum: ['English', 'Assamese'],
      default: 'English',
    },
    isAIEnriched: {
      type: Boolean,
      default: false,
    },
    lastAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for student recommendations
careerRecommendationSchema.index({ student: 1, updatedAt: -1 });

const CareerRecommendation = mongoose.model('CareerRecommendation', careerRecommendationSchema);

export default CareerRecommendation;
