import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is required in x-api-key header');
    }

    const apiKeyEntity = await this.apiKeyService.validateApiKey(apiKey);

    if (!apiKeyEntity) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach API key info to request for use in controllers
    (request as any).apiKey = apiKeyEntity;
    (request as any).orgId = apiKeyEntity.orgId;

    return true;
  }
}

