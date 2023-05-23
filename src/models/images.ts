import mongoose from 'mongoose';

export enum CUSTOM_IMAGE {
  USER = 'user',
}

export interface Image {
  _id?: string;
  name: string;
  size: Number;
  key: string;
  url: string;
  createAt: Date;
}

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number },
  key: { type: String },
  url: { type: String },
  createAt: { type: Date, default: Date.now },
});

export const Image = mongoose.model('Image', schema);
