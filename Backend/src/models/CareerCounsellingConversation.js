import mongoose from 'mongoose';
import { ALL_LANGUAGES, LANGUAGES } from '../constants/languages.js';

const MAX_STORED_MESSAGES = 500;

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    language: {
      type: String,
      enum: ALL_LANGUAGES,
      default: LANGUAGES.ENGLISH,
    },
    messages: {
      type: [messageSchema],
      validate: {
        validator: (messages) => messages.length >= 2 && messages.length <= MAX_STORED_MESSAGES,
        message: `A conversation must contain at least one response pair and no more than ${MAX_STORED_MESSAGES} messages`,
      },
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

conversationSchema.index({ user: 1, lastMessageAt: -1 });

const CareerCounsellingConversation = mongoose.model(
  'CareerCounsellingConversation',
  conversationSchema
);

export default CareerCounsellingConversation;
