import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const MAX_COUNT = 5;

export const incrementApiLimit = async (userId: string): Promise<void> => {
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (userApiLimit) {
    await prisma.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prisma.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkApiLimit = async (userId: string): Promise<boolean> => {
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: { userId: userId },
  });

  return !userApiLimit || userApiLimit.count < MAX_COUNT;
};

export const getApiLimitCount = async (userId: string): Promise<number> => {
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  return !userApiLimit ? 0 : userApiLimit.count;
};

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (userId: string) => {
  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) return false;

  const isValid =
    userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd!.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
