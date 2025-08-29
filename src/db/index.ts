import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

let db: ReturnType<typeof drizzle>;

if (process.env.POSTGRES_URL) {
  const client = postgres(process.env.POSTGRES_URL);
  db = drizzle(client, { schema, logger: true });
} else {
  // This is a placeholder for when no database is configured.
  // The application logic should prevent this from being used.
  // @ts-ignore
  db = {};
}

export { db };
