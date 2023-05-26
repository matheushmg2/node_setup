import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import ApiError from '~src/util/errors/api-error';
import path from 'path';
import fs from 'fs';
import { User } from '~src/models/user';
import { Image } from '~src/models/images';

export async function ImageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let user: any = '';
  let imageOld: any = '';
  if (req.context) {
    user = await User.findById({ _id: req.context?.userId });
    imageOld = await Image.findById({ _id: user?.image.toString() });
  }

  const directoryPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  try {
    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
      },
      filename: (req: any, file: any, cb: any) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);

          const fileName = `${hash.toString('hex')}-${file.originalname}`;

          cb(null, fileName);
        });
      },
    });
    const limits = { fileSize: 2 * 1024 * 1024 };
    const upload = multer({
      storage,
      limits,
      fileFilter: (req, file, cb): void => {
        const allowedMines = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMines.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
          res.status?.(401).send(
            ApiError.format({
              code: 401,
              message: 'Only .png, .jpg and .jpeg format allowed!',
            })
          );
        }
      },
    }).single('file');

    return upload(req, res, (): any => {
      if (imageOld.key !== undefined) return next();

      if (!req.file) {
        return res.status?.(401).send(
          ApiError.format({
            code: 401,
            message: 'unsuitable image or inappropriate image size',
          })
        );
      }

      next();
    });
  } catch (err) {
    if (err instanceof Error) {
      res
        .status?.(401)
        .send(ApiError.format({ code: 401, message: err.message }));
    } else {
      res
        .status?.(401)
        .send(ApiError.format({ code: 401, message: 'Unknown auth error' }));
    }
  }
}
