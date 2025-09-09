
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ToyBrick } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { registerUser } from '@/lib/actions/auth';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      // Automatically log in the user after successful registration
      await login(email, password);
      toast({
        title: 'Account Created!',
        description: "You have been successfully registered and logged in.",
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: (error as Error).message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <ToyBrick className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join ToyCycle and start making a difference.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
             <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                    Sign in
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
