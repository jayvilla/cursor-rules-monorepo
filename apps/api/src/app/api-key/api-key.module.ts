import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyController } from './api-key.controller';
import { RateLimiterService } from './rate-limiter.service';
import { UserRateLimitGuard } from './user-rate-limit.guard';
import { ApiKeyEntity } from '../../entities/api-key.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity]), forwardRef(() => AuthModule)],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyGuard, RateLimiterService, UserRateLimitGuard],
  exports: [ApiKeyService, ApiKeyGuard, RateLimiterService, UserRateLimitGuard],
})
export class ApiKeyModule {}

