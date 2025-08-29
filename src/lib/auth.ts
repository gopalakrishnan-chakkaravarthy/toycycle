
'use server';

import { db } from '@/db';
import { users, NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export const mockLogin = async (email: string, pass: string): Promise<User> => {
  // In a real app, you'd also validate the password.
  // We're keeping it simple here.

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    // Ensure the admin role from the DB is respected
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role as 'admin' | 'user',
      avatar: existingUser.avatar || undefined,
    };
  }

  // If user does not exist, create a new one, unless it's the special admin email
  if (email === 'admin@toycycle.com') {
     throw new Error('Admin user not found. Please seed the database.');
  }

  const newUser: NewUser = {
      name: email.split('@')[0],
      email,
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
  };

  const insertedUsers = await db.insert(users).values(newUser).returning();
  const insertedUser = insertedUsers[0];

   return {
      id: insertedUser.id,
      name: insertedUser.name,
      email: insertedUser.email,
      role: insertedUser.role as 'admin' | 'user',
      avatar: insertedUser.avatar || undefined,
   };
};
