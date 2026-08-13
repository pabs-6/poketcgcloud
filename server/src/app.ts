import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { parseCorsOrigins, isCorsOriginAllowed } from './config/cors.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const corsOrigins = parseCorsOrigins(env.CORS_ORIGIN);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isCorsOriginAllowed(origin, corsOrigins)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
