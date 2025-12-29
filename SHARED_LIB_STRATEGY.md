# Shared Library Strategy: DTOs & Types

## Recommendation: Zod-Based with Boundary Pattern

**Why Zod?**
- ✅ Framework-agnostic (no NestJS dependencies)
- ✅ Excellent TypeScript inference
- ✅ Works seamlessly with Next.js (Server Components, API routes, client)
- ✅ Runtime validation in both environments
- ✅ Can be used in NestJS via `@nestjs/zod` or boundary adapters

## Folder Structure

```
libs/shared/
├── src/
│   ├── index.ts                 # Public API exports
│   │
│   ├── schemas/                 # Zod schemas (source of truth)
│   │   ├── index.ts
│   │   ├── common/
│   │   │   ├── pagination.schema.ts
│   │   │   └── error.schema.ts
│   │   ├── auth/
│   │   │   ├── login.schema.ts
│   │   │   ├── signup.schema.ts
│   │   │   └── password-reset.schema.ts
│   │   ├── users/
│   │   │   └── user.schema.ts
│   │   ├── orgs/
│   │   │   ├── org.schema.ts
│   │   │   └── org-member.schema.ts
│   │   ├── api-keys/
│   │   │   └── api-key.schema.ts
│   │   ├── audit-events/
│   │   │   ├── audit-event.schema.ts
│   │   │   └── query-events.schema.ts
│   │   └── webhooks/
│   │       ├── webhook.schema.ts
│   │       └── webhook-delivery.schema.ts
│   │
│   ├── types/                   # TypeScript types inferred from Zod
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── users.types.ts
│   │   ├── orgs.types.ts
│   │   ├── api-keys.types.ts
│   │   ├── audit-events.types.ts
│   │   └── webhooks.types.ts
│   │
│   └── utils/                   # Shared utilities
│       ├── zod-helpers.ts       # Custom Zod refinements, transforms
│       └── validation.ts        # Validation helpers
│
├── project.json
├── tsconfig.json
└── package.json
```

## Boundary Pattern: NestJS Adapter

```
apps/api/src/
├── common/
│   └── dto/                     # NestJS DTOs (boundary layer)
│       ├── zod-validation.pipe.ts  # Custom pipe using Zod
│       └── adapters/            # Optional: Zod-to-class-validator converters
│
└── modules/
    └── auth/
        └── dto/                 # Module-specific DTOs (if needed)
            └── login.dto.ts     # Thin wrapper or uses Zod directly
```

## Implementation Strategy

### Option 1: Direct Zod in NestJS (Recommended)
Use `@nestjs/zod` or custom ValidationPipe that validates against Zod schemas.

### Option 2: Boundary Adapters
Create class-validator DTOs in `apps/api` that mirror Zod schemas (manual or code-gen).

**We'll use Option 1** for simplicity and type safety.

---

## Example DTO Definition

### 1. Zod Schema (Source of Truth)

**`libs/shared/src/schemas/auth/login.schema.ts`**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
```

**`libs/shared/src/schemas/auth/signup.schema.ts`**

```typescript
import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  orgName: z
    .string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name is too long'),
});

export type SignupInput = z.input<typeof signupSchema>;
export type SignupOutput = z.output<typeof signupSchema>;
```

**`libs/shared/src/schemas/audit-events/audit-event.schema.ts`**

```typescript
import { z } from 'zod';

export const actorSchema = z.object({
  type: z.enum(['user', 'api_key', 'system']),
  id: z.string().uuid().optional(),
  name: z.string().optional(),
});

export const targetSchema = z.object({
  type: z.string().min(1),
  id: z.string().optional(),
  name: z.string().optional(),
});

export const createAuditEventSchema = z.object({
  action: z
    .string()
    .min(1, 'Action is required')
    .max(100, 'Action is too long')
    .regex(/^[a-z_]+\.[a-z_]+$/, 'Action must be in format: resource.action'),
  actor: actorSchema.optional(),
  target: targetSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  timestamp: z.string().datetime().optional(),
});

export const queryAuditEventsSchema = z.object({
  action: z.string().optional(),
  actorType: z.enum(['user', 'api_key', 'system']).optional(),
  actorId: z.string().uuid().optional(),
  targetType: z.string().optional(),
  targetId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateAuditEventInput = z.input<typeof createAuditEventSchema>;
export type CreateAuditEventOutput = z.output<typeof createAuditEventSchema>;
export type QueryAuditEventsInput = z.input<typeof queryAuditEventsSchema>;
export type QueryAuditEventsOutput = z.output<typeof queryAuditEventsSchema>;
```

**`libs/shared/src/schemas/common/pagination.schema.ts`**

```typescript
import { z } from 'zod';

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type PaginationInput = z.input<typeof paginationSchema>;
export type PaginationOutput = z.output<typeof paginationSchema>;
```

### 2. Type Exports

**`libs/shared/src/types/auth.types.ts`**

```typescript
import type { LoginInput, LoginOutput } from '../schemas/auth/login.schema';
import type { SignupInput, SignupOutput } from '../schemas/auth/signup.schema';

export type { LoginInput, LoginOutput, SignupInput, SignupOutput };
```

**`libs/shared/src/types/audit-events.types.ts`**

```typescript
import type {
  CreateAuditEventInput,
  CreateAuditEventOutput,
  QueryAuditEventsInput,
  QueryAuditEventsOutput,
} from '../schemas/audit-events/audit-event.schema';

export type {
  CreateAuditEventInput,
  CreateAuditEventOutput,
  QueryAuditEventsInput,
  QueryAuditEventsOutput,
};
```

### 3. Public API Exports

**`libs/shared/src/schemas/index.ts`**

```typescript
// Auth
export * from './auth/login.schema';
export * from './auth/signup.schema';
export * from './auth/password-reset.schema';

// Users
export * from './users/user.schema';

// Orgs
export * from './orgs/org.schema';
export * from './orgs/org-member.schema';

// API Keys
export * from './api-keys/api-key.schema';

// Audit Events
export * from './audit-events/audit-event.schema';
export * from './audit-events/query-events.schema';

// Webhooks
export * from './webhooks/webhook.schema';
export * from './webhooks/webhook-delivery.schema';

// Common
export * from './common/pagination.schema';
export * from './common/error.schema';
```

**`libs/shared/src/types/index.ts`**

```typescript
export * from './auth.types';
export * from './users.types';
export * from './orgs.types';
export * from './api-keys.types';
export * from './audit-events.types';
export * from './webhooks.types';
```

**`libs/shared/src/index.ts`**

```typescript
// Export schemas (for validation)
export * from './schemas';

// Export types (for TypeScript)
export * from './types';

// Export utilities
export * from './utils/zod-helpers';
export * from './utils/validation';
```

### 4. NestJS Usage (Boundary Pattern)

**`apps/api/src/common/pipes/zod-validation.pipe.ts`**

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

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
```

**`apps/api/src/modules/auth/auth.controller.ts`**

```typescript
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { loginSchema, type LoginOutput } from '@org/shared-dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'Login successful' })
  async login(@Body() dto: LoginOutput) {
    return this.authService.login(dto);
  }
}
```

**Alternative: Using `@nestjs/zod` (if installed)**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { loginSchema, type LoginOutput } from '@org/shared-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Body(ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginOutput) {
    return this.authService.login(dto);
  }
}
```

### 5. Next.js Usage

**`apps/web/src/app/api/auth/login/route.ts`** (API Route)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, type LoginOutput } from '@org/shared-dto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body); // Runtime validation
    
    // Call API or handle login
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    });

    return NextResponse.json(await response.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**`apps/web/src/components/auth/LoginForm.tsx`** (Client Component)

```typescript
'use client';

import { useState } from 'react';
import { loginSchema, type LoginInput } from '@org/shared-dto';
import type { z } from 'zod';

type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Client-side validation
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Submit to API route
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Handle success (redirect, etc.)
    } catch (error) {
      setErrors({ password: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**`apps/web/src/lib/api-client.ts`** (Type-safe API client)

```typescript
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type LoginOutput,
  type SignupInput,
  type SignupOutput,
} from '@org/shared-dto';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function login(input: LoginInput): Promise<LoginOutput> {
  const validated = loginSchema.parse(input);
  
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function signup(input: SignupInput): Promise<SignupOutput> {
  const validated = signupSchema.parse(input);
  
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
}
```

---

## Swagger/OpenAPI Integration

For Swagger documentation in NestJS, you can:

1. **Use `@nestjs/swagger` with Zod schemas** (requires adapter)
2. **Create separate Swagger DTOs** that mirror Zod schemas (manual)
3. **Use `zod-to-openapi`** to generate OpenAPI schemas from Zod

**Recommended: Manual Swagger DTOs for documentation only**

```typescript
// apps/api/src/modules/auth/dto/login.dto.ts (Swagger only)
import { ApiProperty } from '@nestjs/swagger';
import { loginSchema } from '@org/shared-dto';

// This is ONLY for Swagger documentation
// Actual validation uses Zod schema
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  password: string;
}
```

Then use both in controller:

```typescript
@Post('login')
@UsePipes(new ZodValidationPipe(loginSchema))
@ApiOperation({ summary: 'Login user' })
@ApiOkResponse({ type: UserResponseDto })
async login(@Body() dto: LoginOutput) {
  // Implementation
}
```

---

## Package Dependencies

**`libs/shared/package.json`**

```json
{
  "name": "@org/shared-dto",
  "version": "0.0.1",
  "dependencies": {
    "zod": "^3.23.8"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**`apps/api/package.json`** (add to existing)

```json
{
  "dependencies": {
    "@org/shared-dto": "workspace:*",
    "nestjs-zod": "^1.0.0"  // Optional, for better Zod integration
  }
}
```

**`apps/web/package.json`** (add to existing)

```json
{
  "dependencies": {
    "@org/shared-dto": "workspace:*"
  }
}
```

---

## Benefits of This Approach

1. ✅ **Framework-agnostic**: No NestJS dependencies in shared library
2. ✅ **Type safety**: Full TypeScript inference from Zod schemas
3. ✅ **Runtime validation**: Works in both Next.js and NestJS
4. ✅ **Single source of truth**: Zod schemas define both validation and types
5. ✅ **Easy to test**: Zod schemas can be unit tested independently
6. ✅ **Great DX**: Autocomplete and type checking in both environments
7. ✅ **Flexible**: Can add boundary adapters if needed without changing shared lib

---

## Migration Path

1. Install Zod: `pnpm add zod -w`
2. Create `libs/shared` structure
3. Define Zod schemas for each domain
4. Export types from schemas
5. Create `ZodValidationPipe` in NestJS
6. Update controllers to use Zod schemas
7. Update Next.js components to use Zod schemas
8. Add Swagger DTOs for documentation (optional)

