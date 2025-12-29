import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from '../../entities/api-key.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) {}

  /**
   * Validates an API key by hashing it and comparing with stored hash
   */
  async validateApiKey(apiKey: string): Promise<ApiKeyEntity | null> {
    if (!apiKey || !apiKey.startsWith('sk_')) {
      return null;
    }

    // Hash the provided API key using SHA256 (same as seed script)
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Find API key by hash
    const apiKeyEntity = await this.apiKeyRepository.findOne({
      where: { keyHash },
      relations: ['organization'],
    });

    if (!apiKeyEntity) {
      return null;
    }

    // Update last used timestamp
    apiKeyEntity.lastUsedAt = new Date();
    await this.apiKeyRepository.save(apiKeyEntity);

    return apiKeyEntity;
  }

  /**
   * Hash an API key for storage
   */
  hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}

