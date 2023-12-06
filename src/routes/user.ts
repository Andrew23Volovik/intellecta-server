import type { NextFunction, Request, Response } from 'express';
import type { ExtendedUser, TUserRequestDto } from '../types';
import { Router } from 'express';
import { getApiLimitCount } from '../utils/index';

export const userRouter = Router();

userRouter.get(
  '/user',
  async (
    req: Request<any, any, TUserRequestDto<string>, any, any>,
    res: Response<ExtendedUser, any>,
    next: NextFunction,
  ) => {
    const user = res.locals.user as ExtendedUser;

    const apiCount = await getApiLimitCount(user.id);

    return res.status(200).json({
      ...user,
      apiCount,
    });
  },
);
