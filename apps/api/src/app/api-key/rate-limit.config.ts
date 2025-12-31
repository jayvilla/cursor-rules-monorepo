import { ConfigService } from '@nestjs/config';

/**
 * Production-safe rate limit configuration
 * 
 * All values are configurable via environment variables with safe defaults.
 * Limits are per time window (default 60 seconds).
 */
export interface RateLimitConfig {
  // Auth endpoints (login/register) - strict limits per IP
  authWindowMs: number;
  authMaxRequests: number;

  // Audit event ingestion (via API key) - higher limits
  auditIngestWindowMs: number;
  auditIngestMaxRequests: number;

  // Audit event query/export - moderate limits per user session
  auditQueryWindowMs: number;
  auditQueryMaxRequests: number;

  // API key management (create/revoke) - moderate limits
  apiKeyManagementWindowMs: number;
  apiKeyManagementMaxRequests: number;
}

export function getRateLimitConfig(configService: ConfigService): RateLimitConfig {
  const windowMs = 60 * 1000; // 1 minute default window

  return {
    // Auth: 5 requests per minute per IP (strict for security)
    authWindowMs: windowMs,
    authMaxRequests: parseInt(
      configService.get<string>('RATE_LIMIT_AUTH_MAX_REQUESTS', '5'),
      10,
    ),

    // Audit ingest: 300 requests per minute per API key (high throughput)
    auditIngestWindowMs: windowMs,
    auditIngestMaxRequests: parseInt(
      configService.get<string>('RATE_LIMIT_AUDIT_INGEST_MAX_REQUESTS', '300'),
      10,
    ),

    // Audit query: 60 requests per minute per user (moderate)
    auditQueryWindowMs: windowMs,
    auditQueryMaxRequests: parseInt(
      configService.get<string>('RATE_LIMIT_AUDIT_QUERY_MAX_REQUESTS', '60'),
      10,
    ),

    // API key management: 10 requests per minute per user (low/moderate)
    apiKeyManagementWindowMs: windowMs,
    apiKeyManagementMaxRequests: parseInt(
      configService.get<string>('RATE_LIMIT_API_KEY_MANAGEMENT_MAX_REQUESTS', '10'),
      10,
    ),
  };
}

