import OpenAI from 'openai';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const apiKey = process.env.OPEN_AI_KEY;
export const openAI = new OpenAI({
  apiKey,
});
