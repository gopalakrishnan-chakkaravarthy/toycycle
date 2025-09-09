
'use server';

import { eq } from 'drizzle-orm';
import type { NewUser } from '@/db/schema';
import { cookies } from 'next/headers';

// Define a common User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export async function parseUserCookie(userCookieValue: string | undefined): Promise<User | null> {
    if (userCookieValue) {
        try {
            return JSON.parse(userCookieValue);
        } catch (e) {
            return null;
        }
    }
    return null;
}

export async function getCurrentUser(): Promise<User | null> {
    const userCookie = cookies().get('toycycle-user');
    return await parseUserCookie(userCookie?.value);
}


// DB-based login function
const dbLogin = async (email: string): Promise<User> => {
    const { db } = await import('@/db');
    const { users } = await import('@/db/schema');

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role as 'admin' | 'user',
            avatar: existingUser.avatar || undefined,
        };
        cookies().set('toycycle-user', JSON.stringify(user), { httpOnly: true, path: '/' });
        return user;
    }
    
    throw new Error('User not found. Please sign up.');
};


// DB-based registration function
const dbRegister = async (name: string, email: string): Promise<User> => {
    const { db } = await import('@/db');
    const { users } = await import('@/db/schema');

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }
    
    if (email === 'admin@toycycle.com') {
        throw new Error('Cannot register with admin email.');
    }

    const newUser: NewUser = {
        name,
        email,
        role: 'user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
    };

    const insertedUsers = await db.insert(users).values(newUser).returning();
    const insertedUser = insertedUsers[0];
    
    const user = {
        id: insertedUser.id,
        name: insertedUser.name,
        email: insertedUser.email,
        role: insertedUser.role as 'admin' | 'user',
        avatar: insertedUser.avatar || undefined,
    };
    cookies().set('toycycle-user', JSON.stringify(user), { httpOnly: true, path: '/' });
    return user;
};


// Mock login function for when there is no DB
const mockAuthLogin = async (email: string): Promise<User> => {
    const isAdmin = email === 'admin@toycycle.com';
    const user = {
        id: `mock-${email}`,
        name: isAdmin ? 'Admin' : email.split('@')[0],
        email: email,
        role: isAdmin ? 'admin' : 'user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    cookies().set('toycycle-user', JSON.stringify(user), { httpOnly: true, path: '/' });
    return user;
};

const mockAuthRegister = async (name: string, email: string): Promise<User> => {
    if (email === 'admin@toycycle.com') {
        throw new Error('Cannot register with admin email.');
    }
    const user = {
        id: `mock-${email}`,
        name,
        email,
        role: 'user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    cookies().set('toycycle-user', JSON.stringify(user), { httpOnly: true, path: '/' });
    return user;
};


// The main login function that decides whether to use the DB or mock data.
export const login = async (email: string, pass: string): Promise<User> => {
  if (process.env.POSTGRES_URL) {
    return dbLogin(email);
  } else {
    // In a real app, you'd also validate the password.
    return mockAuthLogin(email);
  }
};

export const registerUser = async (name: string, email: string, pass: string): Promise<User> => {
    if (process.env.POSTGRES_URL) {
        return dbRegister(name, email);
    } else {
        // In a real app, you'd hash the password here.
        return mockAuthRegister(name, email);
    }
}

export const logout = async () => {
    cookies().delete('toycycle-user');
}
