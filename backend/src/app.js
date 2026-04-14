import express from 'express';
import compression from "compression";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { plantRouter } from './routes/plant.routes.js';
import { chatRouter } from './routes/chat.routes.js';

const app = express();

app.use(compression());

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL ? env.CLIENT_URL.split(",") : false,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/plant', plantRouter);
app.use('/api/chat', chatRouter);

app.use(errorHandler);

export default app;

