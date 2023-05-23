import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '~src/models/user';
import { BaseController } from './BaseController';
import { SendResponseError } from '~src/util/errors/send-response-error';
import AuthService from '~src/services/auth';
import { AuthMiddleware } from '~src/middlewares/auth';
import { ImageMiddleware } from '~src/middlewares/Image';
import { CUSTOM_IMAGE, Image } from '~src/models/images';
import { Uploader } from '~src/util/cloudinary/Uploader';

@Controller('user')
export class UserController extends BaseController {
  @Get('')
  public async list(req: Request, res: Response) {
    const user = await User.find().populate('image');
    res.status(200).send(user);
  }

  @Middleware(ImageMiddleware)
  @Post('')
  public async create(req: Request, res: Response): Promise<Response | void> {
    const cloudinary = Uploader();
    try {
      let image: any = {};

      if (req.file) {
        const upload = await cloudinary.upload(`${req.file.path}`, {
          public_id: `${CUSTOM_IMAGE.USER}/${req.file.filename}`,
        });

        const { originalname: name, size, filename: key } = req.file;

        image = await Image.create({
          name,
          size,
          key,
          url: upload.secure_url,
        });
      }

      const user = new User({ ...req.body, image });

      return res.status(201).send(user);
    } catch (error: any) {
      SendResponseError.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Put('update')
  @Middleware(AuthMiddleware)
  public async update(req: Request, res: Response): Promise<Response | void> {
    const { body, context } = req;

    const user = await User.findById({ _id: context?.userId });

    if (req.body.email) {
      SendResponseError.sendErrorResponse(res, {
        code: 401,
        message: 'Invalid field: email already exists',
      });
    } else {
      if (user) {
        const data: User = body;
        user.set(data);
        user.save({ validateBeforeSave: false });
        return res.status(201).send(user);
      }
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return SendResponseError.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
      });
    }
    if (
      !(await AuthService.comparePassword(req.body.password, user.password))
    ) {
      return SendResponseError.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(user.id);

    return res.send({ ...user.toJSON(), ...{ token } });
  }

  @Delete('delete')
  public async delete(req: Request, res: Response) {
    const cloudinary = Uploader();

    const { id } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) {
      SendResponseError.sendErrorResponse(res, {
        code: 401,
        message: 'Invalid User: user not exists',
      });
      return;
    }
    try {
      if (user.image._id) {
        const image = await Image.findOne({ _id: user.image._id.toString() });
        if (req && image) {
          await cloudinary.destroy(`${CUSTOM_IMAGE.USER}/${image.key}`);
          await image.deleteOne({ _id: req.params.id });
          await User.deleteOne({ _id: id });
          res.status(201).json({ message: 'User deleted successfully' });
        }
      }
    } catch (error: any) {
      SendResponseError.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
