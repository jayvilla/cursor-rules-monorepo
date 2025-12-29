import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Tokens = require('csrf');

@Injectable()
export class CsrfService {
  private readonly csrfProtection: InstanceType<typeof Tokens>;

  constructor(private readonly configService: ConfigService) {
    this.csrfProtection = new Tokens({
      secretLength: 32,
    });
  }

  generateToken(secret: string): string {
    return this.csrfProtection.create(secret);
  }

  verifyToken(secret: string, token: string): boolean {
    return this.csrfProtection.verify(secret, token);
  }

  createSecret(): string {
    return this.csrfProtection.secretSync();
  }
}

