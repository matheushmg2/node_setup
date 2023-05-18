import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number },
  key: { type: String },
  url: { type: String },
  createAt: { type: Date, default: Date.now },
});

export const Image = mongoose.model('Image', schema);
