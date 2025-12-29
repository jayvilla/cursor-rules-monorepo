import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './api-key.guard';
import { RateLimiterService } from './rate-limiter.service';
import { ApiKeyEntity } from '../../entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [ApiKeyService, ApiKeyGuard, RateLimiterService],
  exports: [ApiKeyService, ApiKeyGuard, RateLimiterService],
})
export class ApiKeyModule {}

