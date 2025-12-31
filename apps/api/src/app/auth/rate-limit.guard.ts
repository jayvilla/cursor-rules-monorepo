import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { RateLimiterService } from '../api-key/rate-limiter.service';

/**
 * Rate limit guard for auth endpoints (login/register)
 * Limits requests per IP address
 */
@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract IP address from request
    const ipAddress =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket.remoteAddress ||
      request.ip ||
      'unknown';

    // Check rate limit (throws if exceeded)
    this.rateLimiterService.checkRateLimitWithType('auth', ipAddress);

    return true;
  }
}

