# Release & Deployment Standards

## Overview

This document describes how to build, test, and deploy the application to different environments.

## Environments

### Development

- **Purpose:** Local development
- **Database:** Local PostgreSQL (Docker)
- **API:** `http://localhost:8000`
- **Web:** `http://localhost:3000`
- **Marketing:** `http://localhost:3001`

### Staging

- **Purpose:** Pre-production testing
- **Database:** Staging PostgreSQL instance
- **URLs:** Staging domains (e.g., `staging-api.example.com`)

### Production

- **Purpose:** Live application
- **Database:** Production PostgreSQL (managed)
- **URLs:** Production domains (e.g., `api.example.com`)

## Pre-Release Checklist

Before releasing:

- [ ] All tests pass (`pnpm test:all`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Formatting is consistent (`pnpm format:check`)
- [ ] Migrations are tested
- [ ] Environment variables are documented
- [ ] Security headers are configured
- [ ] Secrets are rotated (if needed)

## Building

### Build All Projects

```bash
pnpm nx run-many --target=build --all
```

### Build Individual Projects

```bash
# API
pnpm nx build api

# Web
pnpm nx build web

# Marketing
pnpm nx build marketing
```

### Build for Production

```bash
# Set NODE_ENV
export NODE_ENV=production

# Build
pnpm nx run-many --target=build --all --configuration=production
```

## Docker Builds

### API Docker Image

```bash
docker build -f apps/api/Dockerfile -t audit-log-saas-api:latest .
```

**Build Args:**
- None (uses environment variables at runtime)

### Web Docker Image

```bash
docker build \
  -f apps/web/Dockerfile \
  -t audit-log-saas-web:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api \
  .
```

**Build Args:**
- `NEXT_PUBLIC_API_URL` - API URL (required)

### Marketing Docker Image

```bash
docker build \
  -f apps/marketing/Dockerfile \
  -t audit-log-saas-marketing:latest \
  --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
  --build-arg NEXT_PUBLIC_APP_URL=https://app.example.com \
  .
```

## Database Migrations

### Running Migrations

**Development:**
```bash
pnpm db:migrate
```

**Production:**
```bash
# Run migrations before deploying new code
pnpm nx migration:run api
```

### Creating Migrations

```bash
# Generate from entity changes
pnpm db:migrate:generate --name=AddNewColumn

# Create empty migration
pnpm db:migrate:create --name=CustomMigration
```

### Migration Best Practices

1. **Test migrations locally first**
2. **Backup database before production migration**
3. **Run migrations in transaction** (TypeORM does this by default)
4. **Never edit existing migrations** - Create new ones
5. **Review generated migrations** before committing

## Deployment

### Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Individual Services

**API:**
```bash
docker run -d \
  --name api \
  -p 8000:8000 \
  -e DB_HOST=postgres \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=secure-password \
  -e SESSION_SECRET=$(openssl rand -base64 32) \
  -e NODE_ENV=production \
  audit-log-saas-api:latest
```

**Web:**
```bash
docker run -d \
  --name web \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/api \
  -e NODE_ENV=production \
  audit-log-saas-web:latest
```

## Environment Configuration

### Production Environment Variables

**API:**
```env
NODE_ENV=production
DB_HOST=postgres
DB_USERNAME=postgres
DB_PASSWORD=<secure>
DB_DATABASE=postgres
DB_SSL=true
SESSION_SECRET=<32+ char secret>
WEB_ORIGIN=https://app.example.com
SENTRY_DSN=<optional>
```

**Web:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_SENTRY_DSN=<optional>
```

**Marketing:**
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_APP_URL=https://app.example.com
```

## Rollback Procedure

### Database Rollback

```bash
# Revert last migration
pnpm db:migrate:revert
```

### Application Rollback

1. **Revert to previous Docker image:**
   ```bash
   docker tag audit-log-saas-api:previous audit-log-saas-api:latest
   docker-compose up -d --force-recreate
   ```

2. **Or use deployment tooling** (Kubernetes, ECS, etc.)

## Health Checks

### API Health Check

```bash
curl http://localhost:8000/api/health
```

### Web Health Check

```bash
curl http://localhost:3000
```

## Monitoring

### Sentry

- Errors are automatically sent to Sentry (if configured)
- Check Sentry dashboard for production errors

### Logs

```bash
# Docker logs
docker logs -f api
docker logs -f web

# Or use logging aggregation (CloudWatch, etc.)
```

## Release Process

### 1. Prepare Release

- Update version in `package.json` (if versioning)
- Update CHANGELOG.md
- Create release branch: `release/v1.0.0`

### 2. Test

- Run all tests
- Test migrations
- Test deployment locally

### 3. Deploy to Staging

- Deploy to staging environment
- Run smoke tests
- Verify functionality

### 4. Deploy to Production

- Deploy during low-traffic window
- Monitor logs
- Verify health checks
- Rollback if issues

### 5. Post-Deployment

- Monitor error rates
- Check performance metrics
- Verify user reports

## CI/CD Integration

### Recommended CI Steps

```yaml
# Example GitHub Actions
- pnpm install
- pnpm lint
- pnpm typecheck
- pnpm test:all
- pnpm build
- docker build ...
- docker push ...
```

### Deployment Automation

- Use CI/CD tools (GitHub Actions, GitLab CI, etc.)
- Automate Docker builds
- Automate database migrations (with approval)
- Use blue/green or canary deployments

## Security Considerations

1. **Secrets Management:** Use secrets manager (AWS Secrets Manager, etc.)
2. **HTTPS:** Always use HTTPS in production
3. **Database SSL:** Enable `DB_SSL=true`
4. **Session Security:** Strong `SESSION_SECRET` (32+ chars)
5. **CORS:** Restrict `WEB_ORIGIN` to production domain
6. **Rate Limiting:** Configured per endpoint
7. **Security Headers:** Add helmet.js or custom headers

## Troubleshooting

### Build Fails

- Check Node.js version (22+)
- Clear `node_modules` and reinstall
- Check TypeScript errors

### Migration Fails

- Check database connection
- Verify migration file syntax
- Check for conflicting migrations

### Deployment Fails

- Check environment variables
- Verify Docker image builds
- Check container logs

---

**Last Updated:** 2026-01-01

