/**
 * EXAMPLE: NestJS Controller using Zod schema
 * 
 * This file demonstrates how to use Zod schemas from @org/shared-dto
 * in a NestJS controller without importing NestJS decorators into the shared library.
 */

import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { loginSchema, type LoginOutput } from '@org/shared-dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
// import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthControllerExample {
  // constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async login(@Body() dto: LoginOutput) {
    // The dto is already validated and typed by ZodValidationPipe
    // return this.authService.login(dto);
    return { message: 'Login endpoint - implementation needed' };
  }
}

/**
 * Alternative approach using @nestjs/zod (if installed):
 * 
 * import { ZodValidationPipe } from 'nestjs-zod';
 * 
 * @Post('login')
 * @Body(ZodValidationPipe(loginSchema))
 * async login(@Body() dto: LoginOutput) {
 *   return this.authService.login(dto);
 * }
 */

