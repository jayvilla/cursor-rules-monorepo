import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

/**
 * Initialize Sentry for error tracking and monitoring
 * Only initializes if SENTRY_DSN is provided
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    // Sentry disabled if no DSN provided (development mode)
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      // Enable profiling
      nodeProfilingIntegration(),
    ],
    // Scrub sensitive data
    beforeSend(event, _hint) {
      // Remove cookies
      if (event.request?.cookies) {
        event.request.cookies = {};
      }

      // Remove authorization headers
      if (event.request?.headers) {
        const headers = event.request.headers;
        if (headers.authorization) {
          headers.authorization = '[Redacted]';
        }
        if (headers['x-api-key']) {
          headers['x-api-key'] = '[Redacted]';
        }
      }

      return event;
    },
  });
}

