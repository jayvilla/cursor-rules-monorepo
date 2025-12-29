import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import type { Relation } from 'typeorm';
import { OrganizationEntity } from './organization.entity';

export enum ActorType {
  USER = 'user',
  API_KEY = 'api_key',
  SYSTEM = 'system',
}

@Entity({ name: 'audit_events' })
@Index('IDX_audit_events_org_created', ['orgId', 'createdAt'])
@Index('IDX_audit_events_org_action', ['orgId', 'action'])
@Index('IDX_audit_events_org_resource', ['orgId', 'resourceType', 'resourceId'])
export class AuditEventEntity extends BaseEntity {
  @ManyToOne(() => OrganizationEntity, (org) => org.auditEvents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'org_id' })
  organization: Relation<OrganizationEntity>;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({
    name: 'actor_type',
    type: 'enum',
    enum: ActorType,
  })
  actorType: ActorType;

  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId: string | null;

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ name: 'resource_type', type: 'varchar', length: 255 })
  resourceType: string;

  @Column({ name: 'resource_id', type: 'varchar', length: 255 })
  resourceId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;
}

