import type { NextFunction, Request, Response } from 'express';
import type { TUserRequestDto, TUserResponseDto } from '../types';
import type { TImageGenerateMessage, TChatImage } from '../types';
import { Router } from 'express';
import { isApiError, BaseError } from '../types';
import { openAI } from '../openaiAPI';
import { checkApiLimit, checkSubscription, incrementApiLimit } from '../utils/index';

export const imagesRouter = Router();
imagesRouter.post(
  '/images',
  async (
    req: Request<any, any, TUserRequestDto<TImageGenerateMessage>, any, any>,
    res: Response<TUserResponseDto<TChatImage[]> | BaseError | string, any>,
    next: NextFunction,
  ) => {
    const user = res.locals.user;
    const { prompt } = req.body;

    if (!openAI.apiKey) {
      next(new BaseError(500, 'OpenAI API Key not configured.'));
    }

    if (!prompt) {
      next(new BaseError(400, 'Prompt is required.'));
    }

    const freeTrial = await checkApiLimit(user.id);
    const isPro = await checkSubscription(user.id);
    if (!freeTrial && !isPro) next(new BaseError(403, 'Free trial has expired. Please upgrade to pro.'));

    try {
      const { data } = await openAI.images.generate(prompt);

      await incrementApiLimit(user.id);

      return res.status(200).json({
        role: 'assistant',
        content: data,
      });
    } catch (err) {
      if (err instanceof BaseError) {
        next(new BaseError(err.statusCode, err.message));
      } else if (isApiError(err)) {
        next(new BaseError(err.response.status, err.message));
      }
    }
  },
);
