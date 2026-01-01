# Observability Standards

## Overview

This document describes logging, error tracking, and monitoring practices for the application.

## Error Tracking

### Sentry Integration

**Status:** ✅ Configured

**API:**
- Initialized in `apps/api/src/config/sentry.config.ts`
- Global exception filter: `apps/api/src/filters/sentry-exception.filter.ts`
- Environment variable: `SENTRY_DSN`

**Web:**
- Client-side: `apps/web/sentry.client.config.ts`
- Server-side: `apps/web/sentry.server.config.ts`
- Edge: `apps/web/sentry.edge.config.ts`
- Environment variables: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`

**Configuration:**
```typescript
// Only initialize if DSN is provided
if (process.env.SENTRY_DSN) {
  initSentry();
}
```

### Error Handling

**API:**
- Unhandled exceptions caught by Sentry filter
- Errors logged to Sentry with context
- User-friendly error messages returned

**Web:**
- Client errors sent to Sentry
- Server errors sent to Sentry
- Edge runtime errors sent to Sentry

## Logging

### Current State

**API:**
- Uses NestJS `Logger` (console-based)
- No structured logging yet

**Web:**
- Next.js default logging
- No structured logging yet

### Recommended: Structured Logging

**API (Future):**
```typescript
// Use Winston or Pino
import { Logger } from 'winston';

const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
```

**Log Levels:**
- `error` - Errors that need attention
- `warn` - Warnings (e.g., deprecated APIs)
- `info` - Informational (e.g., request logs)
- `debug` - Debug information (development only)

### Logging Best Practices

1. **Structured Logs:** Use JSON format
2. **Context:** Include request ID, user ID, org ID
3. **No Secrets:** Never log passwords, tokens, API keys
4. **Log Levels:** Use appropriate levels
5. **Performance:** Don't log in hot paths

## Request Tracing

### Current State

⚠️ **Missing:** Distributed tracing

### Recommended: OpenTelemetry

**Future Implementation:**
- Use OpenTelemetry for distributed tracing
- Trace requests across API → Database
- Trace requests across Web → API
- Export to Jaeger, Zipkin, or cloud provider

**Example:**
```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('audit-log-api');

async function createAuditEvent(data: CreateAuditEventDto) {
  const span = tracer.startSpan('createAuditEvent');
  try {
    // Business logic
    span.setAttribute('eventType', data.eventType);
    return result;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}
```

## Metrics

### Current State

⚠️ **Missing:** Application metrics

### Recommended Metrics

**API Metrics:**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (errors/second)
- Database query time
- Rate limit hits

**Business Metrics:**
- Audit events created per minute
- Webhook deliveries (success/failure)
- API key usage
- Active users

### Implementation Options

1. **Prometheus + Grafana:**
   - Expose `/metrics` endpoint
   - Scrape with Prometheus
   - Visualize with Grafana

2. **Cloud Provider:**
   - AWS CloudWatch
   - Google Cloud Monitoring
   - Azure Monitor

3. **Application Performance Monitoring (APM):**
   - New Relic
   - Datadog
   - Sentry Performance

## Health Checks

### Current State

⚠️ **Missing:** Health check endpoints

### Recommended Implementation

**API:**
```typescript
@Get('health')
async health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await this.checkDatabase(),
  };
}
```

**Web:**
```typescript
// apps/web/src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

## Monitoring

### Application Monitoring

**Recommended:**
- Uptime monitoring (Pingdom, UptimeRobot)
- Error rate alerts (Sentry)
- Performance monitoring (APM tool)

### Infrastructure Monitoring

**Database:**
- Connection pool metrics
- Query performance
- Slow query logs

**Server:**
- CPU usage
- Memory usage
- Disk I/O
- Network I/O

## Alerting

### Recommended Alerts

1. **Error Rate:** > 1% error rate for 5 minutes
2. **Response Time:** p95 > 1 second for 5 minutes
3. **Database:** Connection pool exhausted
4. **Disk Space:** < 20% free
5. **Memory:** > 80% usage

### Alert Channels

- Email
- Slack
- PagerDuty (for critical alerts)

## Log Retention

### Current State

⚠️ **No retention policy**

### Recommended

- **Application Logs:** 30 days
- **Error Logs:** 90 days
- **Audit Logs:** Per compliance requirements (indefinite for audit logs)

## Performance Monitoring

### API Performance

**Key Metrics:**
- Request latency (p50, p95, p99)
- Throughput (requests/second)
- Database query time
- Memory usage

**Tools:**
- Sentry Performance
- APM tools
- Custom metrics

### Web Performance

**Key Metrics:**
- Page load time
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)

**Tools:**
- Next.js Analytics
- Google Analytics
- Web Vitals

## Debugging

### Development

- Use `console.log` (will be replaced with structured logging)
- Use debugger (VS Code, Chrome DevTools)
- Use Sentry in development (optional)

### Production

- Use Sentry for error tracking
- Use structured logs
- Use distributed tracing (when implemented)

## Observability Checklist

### Current State

- [x] Sentry error tracking
- [ ] Structured logging
- [ ] Distributed tracing
- [ ] Application metrics
- [ ] Health checks
- [ ] Alerting
- [ ] Log retention policy

### Future Improvements

1. **P0:** Add health check endpoints
2. **P1:** Implement structured logging
3. **P1:** Add application metrics
4. **P2:** Implement distributed tracing
5. **P2:** Set up alerting

---

**Last Updated:** 2026-01-01

