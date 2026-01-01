import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRateLimitConfig, RateLimitConfig } from './rate-limit.config';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export type RateLimitType = 'auth' | 'auditIngest' | 'auditQuery' | 'apiKeyManagement';

@Injectable()
export class RateLimiterService {
  private readonly limits = new Map<string, RateLimitEntry>();
  private readonly config: RateLimitConfig;

  constructor(configService: ConfigService) {
    this.config = getRateLimitConfig(configService);
  }

  /**
   * Check if request is within rate limit for audit event ingestion (API key based)
   * @param apiKeyId - The API key ID
   * @returns true if allowed, throws if rate limited
   */
  checkRateLimit(apiKeyId: string): boolean {
    return this.checkRateLimitWithType('auditIngest', apiKeyId);
  }

  /**
   * Check if request is within rate limit by type
   * @param type - The rate limit type
   * @param identifier - Unique identifier (IP address, API key ID, user ID, etc.)
   * @returns true if allowed, throws if rate limited
   */
  checkRateLimitWithType(type: RateLimitType, identifier: string): boolean {
    const now = Date.now();
    const key = `${type}:${identifier}`;
    const entry = this.limits.get(key);

    let windowMs: number;
    let maxRequests: number;

    switch (type) {
      case 'auth':
        windowMs = this.config.authWindowMs;
        maxRequests = this.config.authMaxRequests;
        break;
      case 'auditIngest':
        windowMs = this.config.auditIngestWindowMs;
        maxRequests = this.config.auditIngestMaxRequests;
        break;
      case 'auditQuery':
        windowMs = this.config.auditQueryWindowMs;
        maxRequests = this.config.auditQueryMaxRequests;
        break;
      case 'apiKeyManagement':
        windowMs = this.config.apiKeyManagementWindowMs;
        maxRequests = this.config.apiKeyManagementMaxRequests;
        break;
      default:
        throw new Error(`Unknown rate limit type: ${type}`);
    }

    if (!entry || now > entry.resetAt) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((entry.resetAt - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    entry.count++;
    return true;
  }

  /**
   * Clean up old entries (call periodically in production)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Reset all rate limits (useful for testing)
   */
  reset(): void {
    this.limits.clear();
  }
}

