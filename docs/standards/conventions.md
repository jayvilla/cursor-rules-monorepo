# Code Conventions

## Naming Conventions

### Files & Directories

- **Files:** kebab-case (`user-profile.ts`, `auth.service.ts`)
- **Directories:** kebab-case (`audit-events/`, `api-key/`)
- **Components:** PascalCase files (`Button.tsx`, `UserProfile.tsx`)

### TypeScript

- **Classes:** PascalCase (`UserService`, `AuthController`)
- **Functions:** camelCase (`getUserById`, `validateEmail`)
- **Variables:** camelCase (`userId`, `apiKey`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_PORT`)
- **Types/Interfaces:** PascalCase (`UserDto`, `CreateUserRequest`)
- **Enums:** PascalCase, values UPPER_SNAKE_CASE

```typescript
// ✅ Good
export class UserService {}
export interface UserDto {}
export type CreateUserRequest = {};
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

// ❌ Bad
export class userService {}
export interface user_dto {}
```

### React Components

- **Component names:** PascalCase (`UserProfile`, `AuditLogTable`)
- **Props interfaces:** `ComponentNameProps` (`ButtonProps`, `UserProfileProps`)
- **Hooks:** camelCase with `use` prefix (`useAuth`, `useAuditLogs`)

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad
interface buttonProps {}
export function button() {}
```

## File Structure

### NestJS Modules

```
feature/
├── feature.controller.ts    # Routes
├── feature.service.ts        # Business logic
├── feature.module.ts         # Module definition
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
└── feature.entity.ts        # Database entity (if needed)
```

### Next.js Pages

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── audit-logs/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── layout.tsx
```

### Shared Libraries

```
libs/shared/ui/src/
├── button/
│   ├── button.tsx
│   ├── button.test.tsx
│   └── index.ts
└── index.ts                 # Public API
```

## Import Order

1. External packages
2. Internal path aliases (`@audit-log-and-activity-tracking-saas/*`)
3. Relative imports

```typescript
// ✅ Good
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDto } from '@audit-log-and-activity-tracking-saas/types';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';

// ❌ Bad (mixed order)
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';
```

## Code Style

### TypeScript

- Use `interface` for object shapes
- Use `type` for unions, intersections, computed types
- Prefer `const` over `let`
- Use `readonly` for immutable properties
- Avoid `any` (use `unknown` if needed)

```typescript
// ✅ Good
interface UserDto {
  readonly id: string;
  email: string;
}

type UserRole = 'admin' | 'member' | 'viewer';

// ❌ Bad
type UserDto = {
  id: string;
  email: string;
};
```

### Async/Await

- Prefer `async/await` over Promises
- Always handle errors with try/catch
- Use `Promise.all()` for parallel operations

```typescript
// ✅ Good
async function fetchUsers(): Promise<UserDto[]> {
  try {
    const users = await userRepository.find();
    return users;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

// ❌ Bad
function fetchUsers() {
  return userRepository.find().then(users => users);
}
```

### Error Handling

- Throw specific error types
- Use NestJS exceptions (`BadRequestException`, `UnauthorizedException`)
- Log errors before throwing

```typescript
// ✅ Good
if (!user) {
  throw new NotFoundException('User not found');
}

// ❌ Bad
if (!user) {
  throw new Error('User not found');
}
```

## Comments

- Use JSDoc for public APIs
- Explain "why", not "what"
- Remove commented-out code

```typescript
// ✅ Good
/**
 * Validates user credentials and returns user if valid.
 * @param email - User email address
 * @param password - Plain text password
 * @returns User entity if valid, null otherwise
 */
async validateUser(email: string, password: string): Promise<User | null> {
  // Implementation
}

// ❌ Bad
// This function validates the user
async validateUser(email: string, password: string) {
  // Check if user exists
  // Check password
  // Return user
}
```

## DTOs & Validation

### NestJS DTOs

- Use `class-validator` decorators
- Use `class-transformer` for transformations
- Keep DTOs in `dto/` directory

```typescript
// ✅ Good
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// ❌ Bad
export class CreateUserDto {
  email: string;
  password: string;
}
```

### Shared Types

- Use pure TypeScript (no decorators)
- Keep in `libs/shared/types`
- Use Zod for validation if needed

```typescript
// ✅ Good (libs/shared/types)
export interface UserDto {
  id: string;
  email: string;
  name: string;
}

// ❌ Bad (has NestJS decorators)
export class UserDto {
  @ApiProperty()
  id: string;
}
```

## Testing Conventions

### Test File Names

- Unit tests: `*.spec.ts` (NestJS) or `*.test.tsx` (React)
- Integration tests: `*.integration.spec.ts`
- E2E tests: `*.e2e.spec.ts`

### Test Structure

```typescript
// ✅ Good
describe('UserService', () => {
  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Git Conventions

### Commit Messages

- Use conventional commits: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

```
feat(api): add rate limiting to auth endpoints
fix(web): correct login redirect after session expiry
docs(standards): add architecture documentation
refactor(api): extract CSRF logic to service
```

### Branch Names

- `feature/description`
- `fix/description`
- `docs/description`
- `refactor/description`

---

**Last Updated:** 2026-01-01

