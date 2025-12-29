import { z } from 'zod';

/**
 * Login request schema
 * Used for validating login requests in both Next.js and NestJS
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

// TypeScript types inferred from schema
export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;

