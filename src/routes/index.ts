import { Router } from 'express';
import { videoRouter } from './video';
import { musicRouter } from './music';
import { conversationRouter } from './conversation';
import { imagesRouter } from './images';
import { codeRouter } from './code';
import { userRouter } from './user';
import { stripeRouter } from './stripe/stripe';
import { webhookRouter } from './stripe/webhook';
import { stripeCheckStatusRouter } from './stripe/stripeChechStatus';
export const router = Router();

router.use(userRouter);
router.use(conversationRouter);
router.use(imagesRouter);
router.use(videoRouter);
router.use(musicRouter);
router.use(codeRouter);

router.use(stripeRouter);
router.use(webhookRouter);
router.use(stripeCheckStatusRouter);
