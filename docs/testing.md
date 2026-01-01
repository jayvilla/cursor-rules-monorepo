# Testing Standards

## Overview

This document describes the testing infrastructure, how to run tests, and common troubleshooting.

## Test Stack

### Backend (apps/api)
- **Framework:** Jest + Supertest
- **Database:** Testcontainers (PostgreSQL 16)
- **Type:** Integration tests with real database

### Frontend UI (libs/shared/ui)
- **Framework:** Vitest + React Testing Library
- **Type:** Component unit tests

### E2E (apps/web-e2e, apps/marketing-e2e)
- **Framework:** Playwright
- **Type:** End-to-end browser tests

## Prerequisites

### Required
- **Node.js:** 22+ (see `.nvmrc`)
- **Docker:** Required for Testcontainers (backend tests)
- **pnpm:** 8+ (package manager)

### Docker Setup
Testcontainers requires Docker to be running. Ensure:
- Docker Desktop is running (or Docker Engine on Linux)
- Docker daemon is accessible
- Sufficient resources allocated (2GB+ RAM recommended)

## Running Tests

### Backend Integration Tests

```bash
# Run all API integration tests
pnpm test:api:int

# Run with Nx directly
pnpm nx test api

# Run in watch mode
pnpm nx test api --watch

# Run with coverage
pnpm nx test api --coverage
```

**What it does:**
1. Spins up PostgreSQL container via Testcontainers
2. Runs TypeORM migrations
3. Boots NestJS app in test mode
4. Runs all `*.spec.ts` files
5. Truncates tables between tests
6. Tears down container after all tests

### UI Component Tests

```bash
# Run all UI component tests
pnpm test:ui

# Run in watch mode
cd libs/shared/ui && pnpm vitest

# Run with coverage
cd libs/shared/ui && pnpm vitest --coverage
```

**What it tests:**
- React components in `libs/shared/ui`
- Component rendering
- User interactions
- Accessibility

### E2E Tests

```bash
# Run web app E2E tests
pnpm test:e2e

# Run with Nx directly
pnpm nx e2e web-e2e

# Run in UI mode (interactive)
pnpm nx e2e web-e2e --ui
```

**What it does:**
1. Starts web app dev server
2. Runs Playwright tests in Chromium, Firefox, WebKit
3. Tests full user workflows

### Run All Tests

```bash
pnpm test:all
```

Runs all test suites in sequence.

## Test Structure

### Backend Test Files

```
apps/api/src/
├── test/
│   ├── setup.ts              # Testcontainers + database setup
│   ├── test-app.factory.ts   # NestJS app bootstrap
│   └── http-helpers.ts       # Supertest helpers (CSRF, agents)
└── app/
    └── [feature]/
        └── [feature].spec.ts  # Feature integration tests
```

### UI Test Files

```
libs/shared/ui/src/
├── test-setup.ts             # Vitest + RTL setup
└── lib/
    └── [component]/
        └── [component].test.tsx  # Component tests
```

### E2E Test Files

```
apps/web-e2e/src/
└── *.spec.ts                 # E2E test scenarios
```

## Phase 0 Test Harness

**Current Status:** Phase 0 (Infrastructure Only)

### What Phase 0 Provides

✅ **Test Infrastructure:**
- Testcontainers PostgreSQL setup
- NestJS app bootstrap (`createTestApp()`)
- Database migrations
- Table truncation between tests
- HTTP helpers (Supertest agents, CSRF tokens)

✅ **Determinism:**
- No reliance on external services
- No network calls (except test database)
- Clean database state per test

### What Phase 0 Does NOT Test Yet

❌ **Feature Tests:**
- No actual feature test cases
- No business logic validation
- No API endpoint tests

❌ **Test Helpers:**
- No data factory helpers (createTestUser, etc.)
- No authentication helpers
- No assertion utilities

**Next Phase:** Add feature tests and test helpers.

## Writing Tests

### Backend Integration Test Example

```typescript
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test/test-app.factory';
import { requestWithAgent, requestWithCsrf } from '../test/http-helpers';

describe('Feature Name', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should do something', async () => {
    const agent = requestWithAgent(app);
    
    // GET request
    const response = await agent.get('/api/endpoint').expect(200);
    
    // POST request with CSRF
    await requestWithCsrf(agent, 'post', '/api/endpoint', {
      data: 'value',
    }).expect(201);
  });
});
```

### UI Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Environment Variables

### Backend Tests

Create `apps/api/.env.test` (not committed):

```bash
cp apps/api/.env.test.example apps/api/.env.test
```

**Note:** Testcontainers overrides database connection settings. Other env vars (SESSION_SECRET, etc.) are used.

### Web Tests

Create `apps/web/.env.test` if needed:

```bash
cp apps/web/.env.test.example apps/web/.env.test
```

## Common Issues

### Docker Not Running

**Error:** `Cannot connect to Docker daemon`

**Fix:**
1. Start Docker Desktop
2. Verify Docker is running: `docker ps`
3. Check Docker resources (RAM/CPU)

### Testcontainers Timeout

**Error:** `Container startup timeout`

**Fix:**
1. Increase Docker resources
2. Check network connectivity
3. Pull PostgreSQL image manually: `docker pull postgres:16-alpine`

### Database Connection Errors

**Error:** `Connection refused` or `database does not exist`

**Fix:**
1. Ensure Testcontainers is working: Check container logs
2. Verify migrations ran: Check test output
3. Check `.env.test` file exists

### Port Already in Use

**Error:** `Port 8000 is already in use`

**Fix:**
1. Stop other services using the port
2. Change `PORT` in `.env.test`
3. Kill process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process`

### CSRF Token Errors

**Error:** `Invalid CSRF token`

**Fix:**
- Use `requestWithCsrf()` helper for mutating requests
- Ensure agent is reused (cookies persist)

### TypeScript Errors

**Error:** Type errors in test files

**Fix:**
1. Run `pnpm typecheck` to see all errors
2. Ensure test files are included in `tsconfig.spec.json`
3. Check imports are correct

## Test Coverage

### Current Coverage

**Phase 0:** Infrastructure only (no feature tests yet)

### Viewing Coverage

```bash
# Backend
pnpm nx test api --coverage
open coverage/apps/api/index.html

# UI
cd libs/shared/ui && pnpm vitest --coverage
```

## CI/CD Integration

### Recommended CI Steps

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    pnpm install
    pnpm test:all
```

### Test Parallelization

- **Backend:** Runs serially (maxWorkers: 1) to avoid DB conflicts
- **UI:** Can run in parallel
- **E2E:** Runs serially per browser

## Best Practices

1. **Isolation:** Each test should be independent
2. **Cleanup:** Tables are truncated automatically between tests
3. **Determinism:** No flaky tests (no timers, no external services)
4. **Speed:** Keep tests fast (use Testcontainers efficiently)
5. **Clarity:** Test names should describe behavior

## Troubleshooting

### Debug Test Failures

```bash
# Run single test file
pnpm nx test api --testPathPattern=auth

# Run with verbose output
pnpm nx test api --verbose

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### View Test Logs

```bash
# Backend test logs
pnpm nx test api 2>&1 | tee test-output.log

# E2E test logs
pnpm nx e2e web-e2e --reporter=list
```

### Reset Test Database

Testcontainers creates a fresh database per test run. No manual reset needed.

---

**Last Updated:** 2026-01-01

