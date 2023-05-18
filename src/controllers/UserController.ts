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
import { authMiddleware } from '~src/middlewares/auth';

@Controller('user')
export class UserController extends BaseController {
  @Get('')
  public async list(req: Request, res: Response) {
    const user = await User.find();
    res.status(200).send(user);
  }

  @Post('')
  public async create(req: Request, res: Response) {
    const user = new User(req.body);
    await user.save();
    return res.status(201).send(user);
  }

  @Put('update')
  @Middleware(authMiddleware)
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
      await User.deleteOne({ _id: id });

      res.status(201).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      SendResponseError.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
