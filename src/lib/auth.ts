'use server';

import { eq } from 'drizzle-orm';
import type { NewUser } from '@/db/schema';

// Define a common User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

// DB-based login function
const dbLogin = async (email: string): Promise<User> => {
    // These are dynamically imported so they are only loaded when a DB is configured.
    const { db } = await import('@/db');
    const { users } = await import('@/db/schema');

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role as 'admin' | 'user',
            avatar: existingUser.avatar || undefined,
        };
    }

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

// Mock login function for when there is no DB
const mockAuthLogin = async (email: string): Promise<User> => {
    const isAdmin = email === 'admin@toycycle.com';
    return {
        id: `mock-${email}`,
        name: isAdmin ? 'Admin' : email.split('@')[0],
        email: email,
        role: isAdmin ? 'admin' : 'user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
};

// The main login function that decides whether to use the DB or mock data.
export const mockLogin = async (email: string, pass: string): Promise<User> => {
  if (process.env.POSTGRES_URL) {
    return dbLogin(email);
  } else {
    // In a real app, you'd also validate the password.
    return mockAuthLogin(email);
  }
};
