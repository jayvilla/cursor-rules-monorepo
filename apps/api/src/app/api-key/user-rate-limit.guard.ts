import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { RateLimiterService, RateLimitType } from './rate-limiter.service';

export const RATE_LIMIT_TYPE_KEY = 'rateLimitType';

/**
 * Decorator to specify rate limit type for an endpoint
 */
export const RateLimit = (type: RateLimitType) => SetMetadata(RATE_LIMIT_TYPE_KEY, type);

/**
 * Rate limit guard for authenticated endpoints (user-based rate limiting)
 * Uses the rate limit type specified via @RateLimit() decorator
 */
@Injectable()
export class UserRateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const rateLimitType = Reflect.getMetadata(RATE_LIMIT_TYPE_KEY, handler) as RateLimitType | undefined;

    if (!rateLimitType) {
      // No rate limit specified, allow
      return true;
    }

    // Use userId from session as identifier
    const userId = request.session?.userId;
    if (!userId) {
      // If no user ID, fall back to IP (shouldn't happen with AuthGuard, but safe fallback)
      const ipAddress =
        (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        request.socket.remoteAddress ||
        request.ip ||
        'unknown';
      this.rateLimiterService.checkRateLimitWithType(rateLimitType, ipAddress);
      return true;
    }

    // Check rate limit (throws if exceeded)
    this.rateLimiterService.checkRateLimitWithType(rateLimitType, userId);

    return true;
  }
}

