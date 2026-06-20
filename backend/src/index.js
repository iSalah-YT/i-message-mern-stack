import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';

import clerkWebhook from './webhooks/clerk.webhook.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhook,
);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

// ✅ API routes go here
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
// app.use('/api/messages', messagesRouter);
// app.use('/api/users', usersRouter);
// etc...

// ✅ Serve frontend — must be AFTER all API routes
app.use(express.static(path.join(__dirname, '../public')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);

  if (process.env.NODE_ENV === 'production') job.start();
});
