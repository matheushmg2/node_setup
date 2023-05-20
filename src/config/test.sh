#!/bin/bash

string=$1
declare -l string
string=$string;

case $2 in
controller)
  touch src/controllers/$1Controller.ts
  cat >src/controllers/$1Controller.ts <<EOT
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

@Controller('$string')
export class $1Controller extends BaseController {
  @Get('')
  public async list(req: Request, res: Response) {
  }

  @Post('')
  public async create(req: Request, res: Response) {
  }

  @Put('update')
  public async update(req: Request, res: Response){
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response) {
  }

  @Delete('delete')
  public async delete(req: Request, res: Response) {
  }
}

EOT
  ;;
models)
  touch src/models/$1.ts
  cat >src/models/$1.ts <<EOT
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
      type: String,
      required: true,
      unique: true,
    },
  password: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

export const ${1^} = mongoose.model('${1^}', schema);
EOT
  ;;
services)
  touch src/services/$1.ts
  cat >src/services/$1.ts <<EOT
export default class $1Service {
}
EOT
  ;;
middlewares)
  touch src/middlewares/$1.ts
  cat >src/middlewares/$1.ts <<EOT
import { Request, Response, NextFunction } from 'express';
import ApiError from '~src/util/errors/api-error';

export function ${1^}Middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    next();
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

EOT
  ;;
all)
  touch src/controllers/$1Controller.ts
  cat >src/controllers/$1Controller.ts <<EOT
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

@Controller('$string')
export class $1Controller extends BaseController {
  @Get('')
  public async list(req: Request, res: Response) {
  }

  @Post('')
  public async create(req: Request, res: Response) {
  }

  @Put('update')
  public async update(req: Request, res: Response){
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response) {
  }

  @Delete('delete')
  public async delete(req: Request, res: Response) {
  }
}

EOT

  touch src/models/$1.ts
  cat >src/models/$1.ts <<EOT
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
      type: String,
      required: true,
      unique: true,
    },
  password: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

export const ${1^} = mongoose.model('${1^}', schema);
EOT

  touch src/services/$1.ts
  cat >src/services/$1.ts <<EOT
export default class $1Service {
}
EOT
  ;;
*) echo "Opcao Invalida!" ;;
esac
