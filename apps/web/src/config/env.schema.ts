import { z } from 'zod';

/**
 * Environment variable validation schema for Web (Next.js)
 * Validates all required and optional NEXT_PUBLIC_* variables
 */
export const envSchema = z.object({
  // API URL (required)
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').optional().default('http://localhost:8000/api'),

  // Sentry (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('NEXT_PUBLIC_SENTRY_DSN must be a valid URL').optional(),
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export type EnvSchema = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return validated config
 * Throws error with clear messages if validation fails
 */
export function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => {
        const path = err.path.join('.');
        return `  - ${path}: ${err.message}`;
      }).join('\n');

      throw new Error(
        `❌ Environment variable validation failed:\n${errors}\n\n` +
        'Please check your .env file and ensure all required variables are set correctly.'
      );
    }
    throw error;
  }
}

