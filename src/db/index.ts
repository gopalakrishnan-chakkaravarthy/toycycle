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
  console.log('Database URL not found, using mock database.');
  // This is a placeholder for when no database is configured.
  // The application logic should prevent this from being used for queries.
  // @ts-ignore
  db = {};
}

export { db };
