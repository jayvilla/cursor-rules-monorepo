import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CsrfService } from './csrf.service';
import { CsrfGuard } from './csrf.guard';
import { RolesGuard } from './roles.guard';
import { AuthRateLimitGuard } from './rate-limit.guard';
import { UserEntity } from '../../entities/user.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrganizationEntity]),
    forwardRef(() => ApiKeyModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, CsrfService, CsrfGuard, RolesGuard, AuthRateLimitGuard, AuthGuard],
  exports: [AuthService, CsrfService, CsrfGuard, RolesGuard, AuthGuard],
})
export class AuthModule {}

