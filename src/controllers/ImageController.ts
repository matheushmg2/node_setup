import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { CUSTOM_IMAGE, Image } from '~src/models/images';
import { ImageMiddleware } from '~src/middlewares/Image';
import { SendResponseError } from '~src/util/errors/send-response-error';
import { AuthMiddleware } from '~src/middlewares/auth';
import { User } from '~src/models/user';
import { Uploader } from '~src/util/cloudinary/Uploader';

@Controller('image')
export class ImageController extends BaseController {
  @Get('')
  public async list(req: Request, res: Response) {
    const image = await Image.find();
    res.status(200).send(image);
  }

  @Middleware([ImageMiddleware, AuthMiddleware])
  @Post('')
  public async create(req: Request, res: Response) {
    const cloudinary = Uploader();

    try {
      if (req.file) {
        const upload = await cloudinary.upload(`${req.file.path}`, {
          public_id: `${CUSTOM_IMAGE.IMAGE}/${req.file.filename}`,
        });

        const { originalname: name, size, filename: key } = req.file;

        const image = await Image.create({
          name,
          size,
          key,
          url: upload.secure_url,
        });
        res.status(200).send(image);
      }
    } catch (error: any) {
      SendResponseError.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Put('update')
  public async update(req: Request, res: Response) {}

  @Delete('delete')
  public async delete(req: Request, res: Response) {
    const cloudinary = Uploader();

    try {
      const { id } = req.body;

      const user = await User.findOne({ image: id });
      const image = await Image.findOne({ _id: id });

      if (user) {
        SendResponseError.sendErrorResponse(res, {
          code: 401,
          message: 'Existing user, unable to delete image.',
        });
        return;
      }

      if(!image) {
        SendResponseError.sendErrorResponse(res, {
          code: 401,
          message: 'Non-existent image',
        });
        return;
      }      
      
      if (req && image) {
        await cloudinary.destroy(`${CUSTOM_IMAGE.IMAGE}/${image.key}`);
        await image.deleteOne({ _id: id });

        res.status(201).json({ message: 'Image deleted successfully' });
      }
    } catch (error: any) {
      SendResponseError.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
