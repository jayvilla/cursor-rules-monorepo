import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import type { Relation } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { WebhookDeliveryEntity } from './webhook-delivery.entity';

@Entity({ name: 'webhooks' })
export class WebhookEntity extends BaseEntity {
  @ManyToOne(() => OrganizationEntity, (org) => org.webhooks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'org_id' })
  organization: Relation<OrganizationEntity>;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  secret: string | null;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  events: string[] | null;

  @OneToMany(() => WebhookDeliveryEntity, (delivery) => delivery.webhook, {
    cascade: true,
  })
  deliveries: Relation<WebhookDeliveryEntity[]>;
}

