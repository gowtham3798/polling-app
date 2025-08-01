// models/Comment.ts
import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  pollId: { type: Schema.Types.ObjectId, ref: 'Poll' },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // <-- add this
  email: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
