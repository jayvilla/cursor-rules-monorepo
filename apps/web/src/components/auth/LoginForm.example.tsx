/**
 * EXAMPLE: Next.js Client Component using Zod schema
 * 
 * This file demonstrates how to use Zod schemas from @org/shared-dto
 * in a Next.js client component for form validation.
 */

'use client';

import { useState } from 'react';
import { loginSchema, type LoginInput } from '@org/shared-dto';
import type { z } from 'zod';

type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function LoginFormExample() {
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Client-side validation using Zod schema
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormErrors;
        if (field) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Submit to API route
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ password: error.message || 'Invalid email or password' });
        return;
      }

      // Handle success (redirect, etc.)
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ password: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

