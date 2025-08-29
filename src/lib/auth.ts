
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

const mockUsers: User[] = [
  { id: 'admin-01', name: 'Admin', email: 'admin@toycycle.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin-01' },
  { id: 'user-01', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'user', avatar: 'https://i.pravatar.cc/150?u=user-01' },
];

export const mockLogin = (email: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@toycycle.com') {
        resolve(mockUsers[0]);
      } else if (email) {
         const user: User = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: 'user',
            avatar: `https://i.pravatar.cc/150?u=${email}`
         }
         resolve(user);
      } else {
        reject(new Error('Invalid credentials. Please try again.'));
      }
    }, 1000);
  });
};
