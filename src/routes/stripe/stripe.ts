import type { NextFunction, Request, Response } from 'express';
import type { TUserRequestDto, ExtendedUser } from '../../types';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { stripe } from '../../stripeAPI';
import dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

export const stripeRouter = Router();
const prisma = new PrismaClient();
const returnUrl = `${process.env.APP_URL}/app/settings`;

stripeRouter.get(
  '/stripe',
  async (
    req: Request<any, any, TUserRequestDto<string>, any, any>,
    res: Response<{ url: string | null }, any>,
    next: NextFunction,
  ) => {
    const user = res.locals.user as ExtendedUser;

    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: returnUrl,
      });

      return res.status(200).json({ url: stripeSession.url });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Intellecta',
              description: 'Unlimited AI generations.',
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    res.status(200).json({ url: stripeSession.url });
  },
);
