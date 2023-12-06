import Replicate from 'replicate';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const replicateKey = process.env.REPLICATE_KEY;
export const replicate = new Replicate({
  auth: replicateKey,
  fetch,
});
