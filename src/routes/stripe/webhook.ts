import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { stripe } from '../../stripeAPI';
import dotenv from 'dotenv';
import * as process from 'process';
import { BaseError } from '../../types';
import Stripe from 'stripe';

dotenv.config();

export const webhookRouter = Router();
const prisma = new PrismaClient();

webhookRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'] as string;

  let stripeEvent: Stripe.Event | undefined;
  try {
    stripeEvent = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK as string);
  } catch (e) {
    console.log(['WEBHOOK ERROR', e]);
    return next(new BaseError(400, 'Invalid signature'));
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;

  if (stripeEvent.type === 'checkout.session.completed') {
    const completedSubscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session?.metadata?.userId) {
      return next(new BaseError(400, 'User id is required'));
    }

    try {
      await prisma.userSubscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: completedSubscription.id,
          stripeCustomerId: completedSubscription.customer as string,
          stripePriceId: completedSubscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(completedSubscription.current_period_end * 1000),
        },
      });
    } catch (e) {
      console.log(['WEBHOOK PRISMA DB --CREATE-- ERROR'], e);
    }
  }

  if (stripeEvent.type === 'invoice.payment_succeeded') {
    const succeededSubscription = await stripe.subscriptions.retrieve(session.subscription as string);

    try {
      await prisma.userSubscription.update({
        where: {
          stripeSubscriptionId: succeededSubscription.id,
        },
        data: {
          stripePriceId: succeededSubscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(succeededSubscription.current_period_end * 1000),
        },
      });
    } catch (e) {
      console.log(['WEBHOOK PRISMA DB --UPDATE-- ERROR'], e);
    }
  }

  return res.status(200).end();
});
