import mongoose from 'mongoose';

export enum CUSTOM_IMAGE {
  IMAGE = 'image',
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
  size: { type: Number, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

export const Image = mongoose.model('Image', schema);
