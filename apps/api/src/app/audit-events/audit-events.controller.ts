import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiKeyGuard } from '../api-key/api-key.guard';
import { RateLimiterService } from '../api-key/rate-limiter.service';
import { AuditEventsService } from './audit-events.service';
import { CreateAuditEventDto } from './dto/create-audit-event.dto';

@ApiTags('audit-events')
@Controller('v1/audit-events')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  description: 'API key for authentication',
  required: true,
})
export class AuditEventsController {
  constructor(
    private readonly auditEventsService: AuditEventsService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an audit event' })
  @ApiOkResponse({
    description: 'Audit event created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async createAuditEvent(
    @Body() createDto: CreateAuditEventDto,
    @Req() req: Request,
  ) {
    const apiKey = (req as any).apiKey;
    const orgId = (req as any).orgId;

    // Check rate limit
    this.rateLimiterService.checkRateLimit(apiKey.id);

    // Extract IP and user agent from request
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers['user-agent'] || undefined;

    const result = await this.auditEventsService.createAuditEvent(
      orgId,
      createDto,
      ipAddress,
      userAgent,
    );

    return {
      id: result.id,
      createdAt: result.createdAt.toISOString(),
    };
  }
}

