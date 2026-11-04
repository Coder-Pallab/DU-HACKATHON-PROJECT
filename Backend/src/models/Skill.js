import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: [
          'Programming Language',
          'Framework/Library',
          'Database',
          'Cloud & DevOps',
          'Tool',
          'Soft Skill',
          'Core CS',
          'Other',
        ],
        message: 'Invalid skill category',
      },
      default: 'Other',
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    demandLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High',
    },
    aliases: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;

