import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
  verbose: true,
  strict: true,
});
