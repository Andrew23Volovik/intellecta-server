import type { NextFunction, Request, Response } from 'express';
import type { IBaseError } from '../types';
import { BaseError } from '../types';

export const errorHandler = (err: Error, req: Request, res: Response<IBaseError, any>, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      context: err.context,
    });
  }
};
