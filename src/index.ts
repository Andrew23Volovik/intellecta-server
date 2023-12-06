import type { Application } from 'express';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errors';
import { userHandler } from './middleware/user';
import { router } from './routes/index';

const app: Application = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use(
  [
    '/api/user',
    '/api/conversation',
    '/api/images',
    '/api/video',
    '/api/music',
    '/api/code',
    '/api/stripe',
    '/api/stripe-check-status',
  ],
  userHandler,
);
app.use('/api', router);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
