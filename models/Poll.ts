// models/Poll.ts
import mongoose, { Schema } from 'mongoose';

const optionSchema = new Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const pollSchema = new Schema({
  title: String,
  questions: [
    {
      questionText: String,
      options: [optionSchema],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);
