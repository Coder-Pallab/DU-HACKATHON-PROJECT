import mongoose from 'mongoose';

const requiredSkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    importance: {
      type: String,
      enum: ['Core', 'Preferred'],
      default: 'Core',
    },
    weight: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sector: {
      type: String,
      enum: [
        'Technology',
        'Finance & Banking',
        'Sales & Marketing',
        'Business & Management',
        'Design & Creative',
        'Education & Training',
        'Other',
      ],
      default: 'Technology',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Career description is required'],
      trim: true,
    },
    requiredTechnicalSkills: [requiredSkillSchema],
    requiredSoftSkills: {
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
    industryDemand: {
      type: String,
      enum: ['Very High', 'High', 'Moderate'],
      default: 'High',
    },
    averageSalaryRange: {
      min: { type: Number, default: 400000 },
      max: { type: Number, default: 1200000 },
      currency: { type: String, default: 'INR' },
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level'],
      default: 'Entry Level',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug before validation
careerSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

const Career = mongoose.model('Career', careerSchema);

export default Career;
