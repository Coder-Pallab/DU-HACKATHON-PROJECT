import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true, maxlength: 1200 },
    answer: { type: String, trim: true, maxlength: 6000, default: '' },
    feedback: { type: String, trim: true, maxlength: 1800, default: '' },
    score: { type: Number, min: 0, max: 100, default: null },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
  },
  { _id: true }
);

const mockInterviewSchema = new mongoose.Schema(
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
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
      index: true,
    },
    careerTitle: { type: String, required: true, trim: true },
    contentLanguage: { type: String, enum: ['English', 'Assamese'], required: true },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    questions: {
      type: [interviewQuestionSchema],
      validate: {
        validator: (questions) => questions.length >= 1 && questions.length <= 8,
        message: 'A mock interview must contain between 1 and 8 questions',
      },
    },
    overallScore: { type: Number, min: 0, max: 100, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

mockInterviewSchema.index({ user: 1, career: 1, createdAt: -1 });

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);

export default MockInterview;
