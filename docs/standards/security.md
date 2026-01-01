# Security Standards

## Overview

This document outlines security practices, authentication flows, and security configurations for the application.

## Authentication

### Session-Based (Web)

**Implementation:** Cookie-based sessions stored in PostgreSQL

**Configuration:**
- Cookie name: `sessionId`
- `httpOnly: true` (prevents XSS)
- `sameSite: 'lax'` (CSRF protection)
- `secure: true` (HTTPS only in production)
- `maxAge: 30 days`

**Flow:**
1. User logs in via `POST /api/auth/login`
2. Server creates session, stores in database
3. Session ID set as httpOnly cookie
4. Subsequent requests include cookie automatically
5. Server validates session on each request

**Session Storage:**
- Stored in PostgreSQL `session` table
- Managed by `connect-pg-simple`
- Includes: `userId`, `orgId`, `role`

### API Key (Programmatic)

**Implementation:** Bearer token authentication

**Format:**
```
Authorization: Bearer sk_<api-key>
```

**Flow:**
1. User creates API key via dashboard
2. Key is hashed with bcrypt and stored
3. Client includes key in `Authorization` header
4. Server validates key, extracts `orgId`
5. No CSRF protection (stateless)

**Security:**
- Keys are hashed (bcrypt)
- Keys shown only once on creation
- Keys can be revoked
- Last used timestamp tracked

## CSRF Protection

### Implementation

**Guard:** `apps/api/src/app/auth/csrf.guard.ts`

**Flow:**
1. Client requests CSRF token: `GET /api/auth/csrf`
2. Server generates token, stores secret in session
3. Server sets `csrf-secret` cookie (non-httpOnly)
4. Client includes token in `x-csrf-token` header
5. Server validates token against secret

**Protected Methods:**
- `POST`, `PUT`, `PATCH`, `DELETE`

**Exempt:**
- API key authentication (stateless)
- `GET` requests

## Rate Limiting

### Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth (login/register) | 5 | 15 minutes |
| Audit ingest | 300 | 15 minutes |
| Audit query | 60 | 15 minutes |
| API key management | 10 | 15 minutes |

### Implementation

- **Guard:** `apps/api/src/app/auth/rate-limit.guard.ts`
- **Storage:** In-memory (per-process)
- **Key:** IP address + endpoint

**Future:** Move to Redis for distributed rate limiting

## Security Headers

### Current Status

⚠️ **Missing:** Security headers middleware

### Recommended Headers

```typescript
// Add to apps/api/src/main.ts
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

### Next.js Headers

Add to `apps/web/next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Secrets Management

### Environment Variables

**Never commit:**
- `.env` files (already in `.gitignore`)
- Secrets in code
- API keys in version control

**Required Secrets:**
- `SESSION_SECRET` - Must be 32+ characters in production
- `DB_PASSWORD` - Database password
- `SENTRY_DSN` - Optional, but sensitive

### Generating Secrets

```bash
# SESSION_SECRET
openssl rand -base64 32

# API Key (for testing)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Production Secrets

- Use secrets manager (AWS Secrets Manager, etc.)
- Rotate secrets regularly
- Use different secrets per environment

## Password Security

### Hashing

- **Algorithm:** bcrypt
- **Rounds:** 10 (default)
- **Storage:** Hashed in database (never plaintext)

### Password Requirements

**Current:** No enforced requirements (should add)

**Recommended:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## CORS Configuration

### Current Setup

```typescript
app.enableCors({
  origin: process.env.WEB_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-api-key'],
});
```

### Security Considerations

- ✅ Single origin in production
- ✅ Credentials enabled (for cookies)
- ⚠️ Development allows localhost (acceptable)
- ⚠️ No preflight caching headers

## Input Validation

### DTOs

All inputs validated using `class-validator`:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Validation Pipe

Global validation pipe configured:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,        // Strip unknown properties
    forbidNonWhitelisted: true, // Reject unknown properties
  }),
);
```

## SQL Injection Prevention

### TypeORM

- ✅ Uses parameterized queries
- ✅ No raw SQL with user input
- ✅ Entity-based queries

**Never do:**
```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good
const user = await userRepository.findOne({ where: { email } });
```

## XSS Prevention

### Backend

- ✅ Input validation
- ✅ Output encoding (NestJS handles)
- ✅ httpOnly cookies

### Frontend

- ✅ React escapes by default
- ⚠️ No Content Security Policy (CSP) yet

## Authorization (RBAC)

### Roles

- **Admin:** Full access
- **Member:** Can manage API keys, webhooks
- **Viewer:** Read-only access

### Implementation

**Guard:** `apps/api/src/app/auth/roles.guard.ts`

**Usage:**
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('orgs')
export class OrgsController {}
```

## API Key Security

### Storage

- Keys hashed with bcrypt
- Only key prefix stored (for display)
- Full key shown only once

### Validation

- Check expiration
- Check organization match
- Update last used timestamp

## Session Security

### Session Management

- Sessions stored in PostgreSQL
- Automatic expiration (30 days)
- Manual logout destroys session

### Session Fixation

- New session created on login
- Old session invalidated

## Security Checklist

### Development

- [x] CSRF protection
- [x] Rate limiting
- [x] Input validation
- [x] Password hashing
- [ ] Security headers (P0)
- [ ] CSP headers (P1)

### Production

- [ ] Strong `SESSION_SECRET` (32+ chars)
- [ ] HTTPS enabled
- [ ] Database SSL enabled
- [ ] Security headers configured
- [ ] Secrets in secrets manager
- [ ] Rate limiting on all endpoints
- [ ] Monitoring/alerting configured

## Incident Response

### If Secrets Compromised

1. **Rotate immediately:**
   - `SESSION_SECRET`
   - Database passwords
   - API keys (revoke all)

2. **Force logout all users:**
   - Clear all sessions
   - Require re-authentication

3. **Monitor for abuse:**
   - Check audit logs
   - Monitor API usage

### If Database Breached

1. **Assess damage:**
   - Check what data was accessed
   - Review audit logs

2. **Notify users:**
   - If PII exposed, notify affected users
   - Follow data breach notification laws

3. **Prevent future breaches:**
   - Review access controls
   - Review security practices

## Security Best Practices

1. **Principle of Least Privilege:** Users have minimum required access
2. **Defense in Depth:** Multiple security layers
3. **Fail Secure:** Default to deny
4. **Input Validation:** Validate all inputs
5. **Output Encoding:** Encode all outputs
6. **Error Handling:** Don't leak sensitive info in errors
7. **Logging:** Log security events (but not secrets)
8. **Regular Updates:** Keep dependencies updated
9. **Security Audits:** Regular security reviews
10. **Training:** Keep team informed of security practices

---

**Last Updated:** 2026-01-01

