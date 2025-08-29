import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const runMigrations = async () => {
  console.log('Running database migrations...');
  try {
    const migrationClient = postgres(process.env.POSTGRES_URL!, { max: 1 });
    const db = drizzle(migrationClient);

    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('Migrations completed successfully.');
    await migrationClient.end();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations();
