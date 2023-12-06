import type { User } from '@supabase/supabase-js';

export interface IBaseError {
  statusCode: number;
  message: string;
  context?: string;
}

export class BaseError extends Error implements IBaseError {
  statusCode: number;
  message: string;
  context?: string;
  constructor(statusCode: number, message: string, context?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.context = context;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export type TUserRequestDto<T> = {
  prompt: T;
};

export type TUserResponseDto<T> = {
  role: 'assistant';
  content: T;
};

export interface ExtendedUser extends User {
  apiCount: number;
}

export type TApiError = {
  message: string;
  response: {
    status: number;
    statusText: string;
  };
};

export function isApiError(err: TApiError | Error | unknown): err is TApiError {
  return typeof err === 'object' && err !== null && 'response' in err && 'message' in err;
}

export type TImageGenerateMessage = {
  prompt: string;
  model?: 'dall-e-2' | 'dall-e-3' | null;
  n?: number | null;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;
};

export type TChatImage = {
  url?: string;
};