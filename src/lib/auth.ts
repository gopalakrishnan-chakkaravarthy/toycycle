'use server';

import type { User } from '@/db/schema';

// Define a common User interface
export type { User };


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
