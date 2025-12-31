import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, getTestAgent } from '../../test/test-app.factory';
import { createTestOrganization, createTestUser, getCsrfToken, requestWithCsrf } from '../../test/test-helpers';
import { UserRole } from '../../entities/user.entity';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AuditEventEntity } from '../../entities/audit-event.entity';
import { RateLimiterService } from '../api-key/rate-limiter.service';

describe('Auth Integration (e2e)', () => {
  let app: INestApplication;
  let rateLimiterService: RateLimiterService;

  beforeAll(async () => {
    app = await createTestApp();
    rateLimiterService = app.get(RateLimiterService);
  });

  beforeEach(() => {
    // Reset rate limiter state before each test (in case previous tests consumed quota)
    rateLimiterService.reset();
  });

  afterEach(() => {
    // Reset rate limiter state between tests
    rateLimiterService.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/auth/csrf', () => {
    it('should return CSRF token', async () => {
      const agent = getTestAgent(app);
      const response = await agent.get('/api/auth/csrf').expect(200);
      
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/register', () => {
    it.skip('should create user + org and set session cookie', async () => {
      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      const response = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(201);

      // Check that response contains user data
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.name).toBe('New User');
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.orgId).toBeDefined();

      // Check that session cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
      expect(cookieArray).toEqual(
        expect.arrayContaining([
          expect.stringContaining('sessionId='),
        ]),
      );

      // Verify we can call /auth/me with the session
      const meResponse = await agent.get('/api/auth/me').expect(200);
      expect(meResponse.body.user.email).toBe('newuser@example.com');
    });

    it.skip('should reject duplicate email', async () => {
      const org = await createTestOrganization('Test Org');
      await createTestUser(org.id, 'existing@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        })
        .expect(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it.skip('should set session cookie on successful login', async () => {
      const org = await createTestOrganization('Test Org');
      const user = await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      const response = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Check that response contains user data
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');

      // Check that session cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
      expect(cookieArray).toEqual(
        expect.arrayContaining([
          expect.stringContaining('sessionId='),
        ]),
      );
      
      // Verify cookie is httpOnly
      const sessionCookie = cookieArray.find((cookie: string) => cookie.startsWith('sessionId='));
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie).toContain('HttpOnly');
    });

    it('should reject invalid credentials', async () => {
      const org = await createTestOrganization('Test Org');
      await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it.skip('should destroy session', async () => {
      const org = await createTestOrganization('Test Org');
      await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      // Login first
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Verify we're logged in
      await agent.get('/api/auth/me').expect(200);

      // Logout
      const logoutCsrfToken = await getCsrfToken(agent);
      await agent
        .post('/api/auth/logout')
        .set('x-csrf-token', logoutCsrfToken)
        .expect(200);

      // Verify we're logged out
      await agent.get('/api/auth/me').expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it.skip('should return current user when authenticated', async () => {
      const org = await createTestOrganization('Test Org');
      const user = await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      // Login to set session cookie
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Then call /auth/me with the cookie
      const response = await agent
        .get('/api/auth/me')
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.id).toBe(user.id);
      expect(response.body.user.orgId).toBe(org.id);
    });

    it('should return 401 when not authenticated', async () => {
      const agent = getTestAgent(app);
      await agent
        .get('/api/auth/me')
        .expect(401);
    });
  });

  describe('CSRF Guard Behavior', () => {
    it('should reject POST without CSRF token', async () => {
      const agent = getTestAgent(app);
      
      await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400); // CSRF guard returns 400 for missing CSRF token
    });

    it.skip('should reject PATCH without CSRF token', async () => {
      const org = await createTestOrganization('Test Org');
      const user = await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      // Login first
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Try to update without CSRF token
      await agent
        .patch('/api/users/me')
        .send({ name: 'Updated Name' })
        .expect(400); // CSRF guard returns 400 for missing CSRF token
    });

    it.skip('should accept POST with CSRF token', async () => {
      const org = await createTestOrganization('Test Org');
      await createTestUser(org.id, 'test@example.com', 'password123');

      const agent = getTestAgent(app);
      const csrfToken = await getCsrfToken(agent);
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);
    });
  });
});

