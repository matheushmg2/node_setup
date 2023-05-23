import AuthService from '~src/services/auth';
import mongoose, { Document, Model } from 'mongoose';
import {
  validateEmail,
  validateSizeText,
  validatePasswordSizeAndCaracter,
} from '~src/util/validation/User/validateUser';
import { Image } from './images';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image: Image;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: [
        {
          validator: (value: string) => validateSizeText(value, 5),
          msg: 'Must contain at least 5 characters.',
        },
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, 'Please, type a valid email'],
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: (value: string) => validatePasswordSizeAndCaracter(value),
          msg: 'Must contain at least one special character and at least 8 characters.',
        },
        {
          validator: (value: string) =>
            validatePasswordSizeAndCaracter(value, true),
          msg: 'There must be at least 5 characters equal to the text.',
        },
      ],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      require: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret: any): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Verificando se existe um email dentro do banco de dados no caso do MongoDB
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

// Estou usando "function" para utilizar o this apenas dentro da função, não pegando o this globalmente como seria no caso da Arrow Functions
schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password, 10);
    this.password = hashedPassword;
  } catch (error) {
    console.error(
      `Error hashing the password for the user ${this.name}`,
      error
    );
  }
});

export const User: Model<UserModel> = mongoose.model<UserModel>('User', schema);
