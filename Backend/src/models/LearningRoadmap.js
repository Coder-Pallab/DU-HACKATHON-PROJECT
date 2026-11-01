import mongoose from 'mongoose';

const roadmapPhaseSchema = new mongoose.Schema(
  {
    sequence: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    focusSkill: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skill', 'Career'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    weekStart: {
      type: Number,
      required: true,
      min: 1,
    },
    weekEnd: {
      type: Number,
      required: true,
      min: 1,
    },
    objective: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    activities: {
      type: [String],
      validate: {
        validator: (activities) =>
          activities.length > 0 &&
          activities.length <= 5 &&
          activities.every((activity) => activity.length <= 300),
        message: 'Each roadmap phase must have 1 to 5 activities of at most 300 characters',
      },
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const learningRoadmapSchema = new mongoose.Schema(
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
    sourceAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillGapAnalysis',
      required: true,
    },
    careerTitle: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    phases: {
      type: [roadmapPhaseSchema],
      validate: {
        validator: (phases) => phases.length > 0,
        message: 'A learning roadmap must contain at least one phase',
      },
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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

learningRoadmapSchema.index({ user: 1, career: 1, createdAt: -1 });

const LearningRoadmap = mongoose.model('LearningRoadmap', learningRoadmapSchema);

export default LearningRoadmap;
