import { z } from 'zod';

/**
 * Environment variable validation schema for Marketing (Next.js)
 * Validates all required and optional NEXT_PUBLIC_* variables
 */
export const envSchema = z.object({
  // Site URL (required for SEO metadata, canonical URLs, sitemap, robots.txt)
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .optional()
    .default('http://localhost:3001'),

  // App URL (required for links to web app, e.g., "Sign in" buttons)
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000'),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
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
      const errors = error.issues
        .map((err) => {
          const path = err.path.join('.');
          return `  - ${path}: ${err.message}`;
        })
        .join('\n');

      throw new Error(
        `❌ Environment variable validation failed:\n${errors}\n\n` +
          'Please check your .env file and ensure all required variables are set correctly.'
      );
    }
    throw error;
  }
}

