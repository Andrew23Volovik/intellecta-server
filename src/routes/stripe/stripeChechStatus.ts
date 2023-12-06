import type { NextFunction, Request, Response } from 'express';
import type { TUserRequestDto, ExtendedUser } from '../../types';
import { Router } from 'express';
import { checkSubscription } from '../../utils/index';

export const stripeCheckStatusRouter = Router();

stripeCheckStatusRouter.get(
  '/stripe-check-status',
  async (
    req: Request<any, any, TUserRequestDto<string>, any, any>,
    res: Response<boolean, any>,
    next: NextFunction,
  ) => {
    const user = res.locals.user as ExtendedUser;

    const result = await checkSubscription(user.id);

    return res.status(200).json(result);
  },
);
