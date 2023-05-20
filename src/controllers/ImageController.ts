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
import { Image } from '~src/models/images';
import { ImageMiddleware } from '~src/middlewares/Image';
import cloudinary from 'cloudinary';
import { SendResponseError } from '~src/util/errors/send-response-error';
import { AuthMiddleware } from '~src/middlewares/auth';

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
    const result = cloudinary.v2;
    result.config({
      cloud_name: process.env.cloudinary_cloud_name,
      api_key: process.env.cloudinary_api_key,
      api_secret: process.env.cloudinary_api_secret
    });

    try {
      if (req.file) {
        const upload = await result.uploader.upload(`${req.file.path}`, {
          public_id: `user/${req.file.filename}`,
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
  public async delete(req: Request, res: Response) {}
}
