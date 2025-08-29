import { db } from './index';
import { users } from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  console.log('Seeding database...');
  try {
    // Seed admin user
    const adminExists = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'admin@toycycle.com'),
    });

    if (!adminExists) {
      await db.insert(users).values({
        name: 'Admin',
        email: 'admin@toycycle.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=admin-01',
      });
      console.log('Admin user seeded.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
