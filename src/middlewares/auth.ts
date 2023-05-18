import { Request, Response, NextFunction } from 'express';
import AuthService from '~src/services/auth';
import ApiError from '~src/util/errors/api-error';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.['x-access-token'];
  try {
    const claims = AuthService.decodeToken(token as string);
    req.context = { userId: claims.sub };
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
