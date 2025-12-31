import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // Scrub sensitive data
  beforeSend(event, hint) {
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
    }

    return event;
  },
});

