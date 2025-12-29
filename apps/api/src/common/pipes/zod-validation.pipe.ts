import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

/**
 * Custom validation pipe that uses Zod schemas
 * This allows us to use Zod schemas from @org/shared-dto in NestJS
 * without requiring class-validator decorators in the shared library
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          statusCode: 400,
          message: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
          error: 'Validation failed',
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

