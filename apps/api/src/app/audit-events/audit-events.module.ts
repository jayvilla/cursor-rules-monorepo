import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditEventsController } from './audit-events.controller';
import { AuditEventsService } from './audit-events.service';
import { AuditEventEntity } from '../../entities/audit-event.entity';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditEventEntity]),
    ApiKeyModule,
  ],
  controllers: [AuditEventsController],
  providers: [AuditEventsService],
  exports: [AuditEventsService],
})
export class AuditEventsModule {}

