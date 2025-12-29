import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEventEntity, ActorType } from '../../entities/audit-event.entity';
import type { CreateAuditEventRequest } from '@cursor-rules-monorepo/types';

@Injectable()
export class AuditEventsService {
  constructor(
    @InjectRepository(AuditEventEntity)
    private readonly auditEventRepository: Repository<AuditEventEntity>,
  ) {}

  async createAuditEvent(
    orgId: string,
    request: CreateAuditEventRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ id: string; createdAt: Date }> {
    // Map actor type from DTO to entity enum
    const actorTypeMap: Record<string, ActorType> = {
      user: ActorType.USER,
      'api-key': ActorType.API_KEY,
      system: ActorType.SYSTEM,
    };

    const auditEvent = this.auditEventRepository.create({
      orgId,
      actorType: actorTypeMap[request.actor.type] || ActorType.SYSTEM,
      actorId: request.actor.id,
      action: request.action,
      resourceType: request.resource.type,
      resourceId: request.resource.id,
      metadata: request.metadata || null,
      ipAddress: ipAddress || request.ipAddress || null,
      userAgent: userAgent || request.userAgent || null,
    });

    const saved = await this.auditEventRepository.save(auditEvent);

    return {
      id: saved.id,
      createdAt: saved.createdAt,
    };
  }
}

