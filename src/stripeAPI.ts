import Stripe from 'stripe';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET as string;
export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2023-10-16',
  typescript: true,
});
