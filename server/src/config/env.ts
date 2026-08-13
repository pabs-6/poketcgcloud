import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z
    .string()
    .trim()
    .min(1, 'MONGODB_URI es obligatoria')
    .refine(
      (uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'),
      'MONGODB_URI debe empezar por mongodb:// o mongodb+srv:// (copia el connection string de MongoDB Atlas)'
    ),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('7d'),
  POKEMON_TCG_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:');
  for (const [key, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
    console.error(`  ${key}: ${messages?.join(', ')}`);
  }
  console.error('\nEn Render: Dashboard → tu servicio → Environment → añade MONGODB_URI, JWT_SECRET, CORS_ORIGIN, etc.');
  process.exit(1);
}

export const env = parsed.data;
