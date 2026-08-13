import app from './app.js';
import { env } from './config/env.js';
import { parseCorsOrigins } from './config/cors.js';
import { connectDatabase } from './config/database.js';

async function start() {
  try {
    console.log(`Starting server (NODE_ENV=${env.NODE_ENV}, PORT=${env.PORT})...`);
    console.log(`CORS: ${parseCorsOrigins(env.CORS_ORIGIN).join(', ')}`);
    await connectDatabase();
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
