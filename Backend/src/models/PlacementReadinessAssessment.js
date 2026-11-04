import mongoose from 'mongoose';

const readinessCategorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    weight: { type: Number, min: 0, required: true },
    evidence: { type: [String], default: [] },
  },
  { _id: false }
);

const placementReadinessAssessmentSchema = new mongoose.Schema(
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
    careerTitle: { type: String, required: true, trim: true },
    contentLanguage: { type: String, enum: ['English', 'Assamese'], required: true },
    overallScore: { type: Number, min: 0, max: 100, default: null },
    assessmentStatus: {
      type: String,
      enum: ['assessed', 'insufficient_data'],
      required: true,
    },
    categoryScores: { type: [readinessCategorySchema], default: [] },
    strengths: { type: [String], default: [] },
    areasToImprove: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    explanation: { type: String, required: true, trim: true, maxlength: 1200 },
    disclaimer: { type: String, required: true, trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

placementReadinessAssessmentSchema.index({ user: 1, career: 1, createdAt: -1 });

const PlacementReadinessAssessment = mongoose.model(
  'PlacementReadinessAssessment',
  placementReadinessAssessmentSchema
);

export default PlacementReadinessAssessment;
