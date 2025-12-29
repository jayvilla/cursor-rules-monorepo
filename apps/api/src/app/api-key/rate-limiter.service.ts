import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimiterService {
  private readonly limits = new Map<string, RateLimitEntry>();
  private readonly windowMs = 60 * 1000; // 1 minute
  private readonly maxRequests = 100; // 100 requests per minute per API key

  /**
   * Check if request is within rate limit
   * @param apiKeyId - The API key ID
   * @returns true if allowed, throws if rate limited
   */
  checkRateLimit(apiKeyId: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(apiKeyId);

    if (!entry || now > entry.resetAt) {
      // Reset or create new entry
      this.limits.set(apiKeyId, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
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
}

