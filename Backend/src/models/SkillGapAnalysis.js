import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skill'],
      default: 'Technical',
    },
    importance: {
      type: String,
      enum: ['Core', 'Preferred'],
      default: 'Core',
    },
    weight: {
      type: Number,
      min: 0,
      default: 1,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    learningSteps: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const skillGapAnalysisSchema = new mongoose.Schema(
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
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
      index: true,
    },
    careerTitle: {
      type: String,
      required: true,
      trim: true,
    },
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
      type: [skillGapSchema],
      default: [],
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    isAIEnriched: {
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

skillGapAnalysisSchema.index({ user: 1, career: 1, createdAt: -1 });

const SkillGapAnalysis = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);

export default SkillGapAnalysis;
