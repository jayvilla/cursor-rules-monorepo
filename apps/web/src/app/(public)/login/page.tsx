'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, getMe } from '../../../lib/api-client';
import { usePageTitle } from '../../../lib/use-page-title';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
} from '@audit-log-and-activity-tracking-saas/ui';
import { cn } from '../../../lib/utils';

export default function LoginPage() {
  usePageTitle('Sign In');
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Login
      await login(email, password);

      // Verify login by fetching /auth/me
      const meResponse = await getMe();
      if (!meResponse || !meResponse.user) {
        throw new Error('Login verification failed');
      }

      // Redirect to audit-logs on success
      router.push('/audit-logs');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md">
        <Card variant="bordered">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold text-fg">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-fg-muted">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-fg"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={!!error}
                  placeholder="admin@example.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-fg"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  error={!!error}
                  placeholder="Enter your password"
                  className="h-11"
                />
              </div>

              {error && (
                <div
                  className={cn(
                    'bg-accent-10 border border-accent-30 text-accent',
                    'px-4 py-3 rounded-md text-sm',
                    'flex items-center gap-2'
                  )}
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            {marketingUrl && (
              <div className="pt-4 border-t border-border">
                <a
                  href={marketingUrl}
                  className="text-sm text-fg-muted hover:text-fg transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to home
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

