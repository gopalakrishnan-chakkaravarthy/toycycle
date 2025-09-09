
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
