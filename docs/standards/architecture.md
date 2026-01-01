# Architecture Standards

## Overview

This document defines architectural boundaries, layering rules, and what code belongs where in the monorepo.

## Project Structure

```
apps/
├── api/          # NestJS backend (REST API)
├── web/          # Next.js dashboard (authenticated app)
├── marketing/    # Next.js marketing site (public, SEO)
├── *-e2e/        # E2E test projects

libs/
└── shared/
    ├── types/         # Shared DTOs/types (no framework deps)
    ├── ui/            # React components (framework-agnostic)
    ├── design-system/ # Tailwind tokens, CSS
    └── motion/        # Animation utilities
```

## Layering Rules

### Rule 1: Apps Depend on Libs (Never Reverse)

- ✅ `apps/api` → `libs/shared/types`
- ✅ `apps/web` → `libs/shared/types`, `libs/shared/ui`, etc.
- ❌ `libs/shared/*` → `apps/*` (FORBIDDEN)

### Rule 2: No Cross-App Imports

- ❌ `apps/web` → `apps/api` (FORBIDDEN)
- ❌ `apps/marketing` → `apps/web` (FORBIDDEN)
- ✅ Use `libs/shared/types` for shared contracts

### Rule 3: Lib Dependencies

- ✅ `libs/shared/ui` → `libs/shared/design-system`
- ✅ `libs/shared/types` → no dependencies (pure TypeScript)
- ❌ Circular dependencies between libs (FORBIDDEN)

## Nx Tags & Boundaries

### Tag Structure

All projects must have tags:

```json
{
  "tags": [
    "type:app|lib|e2e",
    "scope:api|web|marketing|shared"
  ]
}
```

### Tag Meanings

- **type:app** - Application (runnable)
- **type:lib** - Library (importable)
- **type:e2e** - E2E test project
- **scope:api** - Backend code
- **scope:web** - Dashboard app
- **scope:marketing** - Marketing site
- **scope:shared** - Shared across apps

### Boundary Enforcement

ESLint enforces:
- `type:app` can only import `type:lib`
- `scope:web` cannot import `scope:api`
- `scope:api` cannot import `scope:web`

## What Goes Where

### `apps/api/`

**Contains:**
- NestJS modules, controllers, services
- TypeORM entities
- Database migrations
- API routes (`/api/*`)
- Authentication/authorization logic
- Business logic

**Does NOT contain:**
- React components
- Next.js pages
- Frontend-specific code

### `apps/web/`

**Contains:**
- Next.js App Router pages
- Dashboard UI components (app-specific)
- Client-side API clients
- Route protection middleware

**Does NOT contain:**
- Backend business logic
- Database entities
- API route handlers (use `apps/api`)

### `apps/marketing/`

**Contains:**
- Next.js marketing pages
- SEO metadata
- Public-facing content
- Marketing-specific components

**Does NOT contain:**
- Authenticated routes
- Dashboard components
- API integration (except public endpoints)

### `libs/shared/types/`

**Contains:**
- DTOs (Data Transfer Objects)
- TypeScript types/interfaces
- Enums
- Pure TypeScript (no framework deps)

**Does NOT contain:**
- NestJS decorators
- React components
- Business logic

### `libs/shared/ui/`

**Contains:**
- Reusable React components
- Component libraries (Radix UI wrappers)
- Framework-agnostic UI primitives

**Does NOT contain:**
- App-specific components
- Business logic
- API calls

### `libs/shared/design-system/`

**Contains:**
- Tailwind theme configuration
- CSS variables
- Design tokens
- Global styles

**Does NOT contain:**
- Components
- Business logic

## Import Rules

### Allowed Imports

```typescript
// ✅ App importing shared lib
import { UserDto } from '@audit-log-and-activity-tracking-saas/types';

// ✅ Lib importing another lib
import { Button } from '@audit-log-and-activity-tracking-saas/ui';

// ✅ App importing from same app
import { AuthService } from '../auth/auth.service';
```

### Forbidden Imports

```typescript
// ❌ Cross-app import
import { UserEntity } from '../../apps/api/src/entities/user.entity';

// ❌ Lib importing app
import { ApiService } from '../../apps/api/src/app/api.service';

// ❌ Direct file path (use path aliases)
import { UserDto } from '../../../libs/shared/types/src/user.dto';
```

## Path Aliases

Use TypeScript path aliases (defined in `tsconfig.base.json`):

```typescript
// ✅ Use aliases
import { UserDto } from '@audit-log-and-activity-tracking-saas/types';
import { Button } from '@audit-log-and-activity-tracking-saas/ui';

// ❌ Don't use relative paths across boundaries
import { UserDto } from '../../../libs/shared/types/src/index';
```

## Module Boundaries

### API Module Structure

```
apps/api/src/app/
├── auth/          # Authentication module
├── users/         # User management
├── audit-events/  # Core audit logging
├── webhooks/      # Webhook delivery
└── api-key/       # API key management
```

Each module is self-contained:
- Controller (routes)
- Service (business logic)
- DTOs (validation)
- Entity (database)

### Web Module Structure

```
apps/web/src/app/
├── (auth)/        # Auth routes (login, signup)
├── (dashboard)/   # Protected routes
│   ├── audit-logs/
│   ├── api-keys/
│   └── settings/
└── api/           # Next.js API routes (proxies to backend)
```

## Data Flow

### Request Flow (Web → API)

1. User action in `apps/web`
2. API client calls `apps/api` endpoint
3. `apps/api` validates, processes, returns data
4. `apps/web` renders response

### Shared Contracts

- DTOs in `libs/shared/types` define API contracts
- Both `apps/api` and `apps/web` import same DTOs
- Changes to DTOs affect both apps (intentional coupling)

## Testing Boundaries

- **Unit tests** - Co-located with code (`*.spec.ts`)
- **Integration tests** - `apps/api-e2e/`, `apps/web-e2e/`
- **Component tests** - In `libs/shared/ui` (Vitest)

## Migration Strategy

When adding new code:

1. **Is it reusable?** → `libs/shared/*`
2. **Is it app-specific?** → `apps/*`
3. **Is it a type/contract?** → `libs/shared/types`
4. **Is it UI?** → `libs/shared/ui` or `apps/*/src/components`

## Violations

If you see a boundary violation:

1. Check if code is in the right place
2. Move code to appropriate location
3. Update imports
4. Verify ESLint passes

---

**Last Updated:** 2026-01-01

