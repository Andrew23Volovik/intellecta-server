import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../supabase';
import { BaseError } from '../types';

export const userHandler = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.headers['authorization']?.split('Bearer ').pop();

  const {
    data: { user },
  } = await supabase.auth.getUser(jwtToken);

  if (!user) {
    next(new BaseError(401, 'Unauthorized.'));
  }
  res.locals = { user };
  next();
};
