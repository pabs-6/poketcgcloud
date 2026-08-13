import app from './app.js';
import { env } from './config/env.js';
import { parseCorsOrigins } from './config/cors.js';
import { connectDatabase } from './config/database.js';

async function start() {
  console.log(`Starting server (NODE_ENV=${env.NODE_ENV}, PORT=${env.PORT})...`);
  console.log(`CORS: ${parseCorsOrigins(env.CORS_ORIGIN).join(', ')}`);

  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${env.PORT}`);
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error('MongoDB connection failed — API is up but auth/data routes will not work:', error);
  }
}

start();
