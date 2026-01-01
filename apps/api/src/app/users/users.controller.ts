import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CsrfGuard } from '../auth/csrf.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditEventsService } from '../audit-events/audit-events.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditEventsService: AuditEventsService,
  ) {}

  @Patch('me')
  @UseGuards(AuthGuard, CsrfGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string', nullable: true },
            orgId: { type: 'string', format: 'uuid' },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Invalid CSRF token' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async updateMe(@Body() updateDto: UpdateUserDto, @Req() req: Request) {
    const userId = req.session.userId;
    const orgId = req.session.orgId;

    if (!userId || !orgId) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Update user
    const updatedUser = await this.usersService.updateUser(userId, updateDto);

    // Extract IP and user agent for audit logging
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      null;
    const userAgent = (req.headers['user-agent'] as string) || null;

    // Create audit event for profile update
    try {
      await this.auditEventsService.createAuditEvent(
        orgId,
        {
          eventType: 'user.profile_updated',
          actor: {
            type: 'user',
            id: userId,
            email: updatedUser.email,
            name: updatedUser.name || undefined,
          },
          resource: {
            type: 'user',
            id: userId,
            name: updatedUser.name || undefined,
          },
          action: 'profile_updated',
          metadata: { field: 'name' },
        },
        ipAddress ?? undefined,
        userAgent ?? undefined,
      );
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to create audit event for user profile update:', error);
    }

    // Return updated user in same format as GET /api/auth/me
    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        orgId: updatedUser.orgId,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
}

