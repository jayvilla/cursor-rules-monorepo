/**
 * Runtime environment variable validation for Next.js
 * Import and call this in server-side code (e.g., API routes, server components)
 * 
 * Note: For client-side, validation happens at build time via Next.js.
 * This function provides runtime validation for server-side code.
 */

import { validateEnv as validateEnvSchema } from './env.schema';

let validated = false;

/**
 * Validate environment variables at runtime (server-side only)
 * Call this in API routes or server components that need env validation
 */
export function validateEnv(): void {
  if (validated) {
    return;
  }

  try {
    validateEnvSchema();
    validated = true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Environment variable validation failed:', error.message);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      console.warn('⚠️  Continuing in non-production mode despite validation errors');
    }
    validated = true; // Mark as validated to prevent repeated errors
  }
}

