import { INestApplication } from '@nestjs/common';
import { createTestApp, getTestAgent } from '../../test/test-app.factory';
import { createTestOrganization, createTestUser, getCsrfToken } from '../../test/test-helpers';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AuditEventEntity } from '../../entities/audit-event.entity';
import { RateLimiterService } from '../api-key/rate-limiter.service';

describe('Users Integration (e2e)', () => {
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

  describe.skip('PATCH /api/users/me', () => {
    it('should update user name', async () => {
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

      // Update name
      const updateCsrfToken = await getCsrfToken(agent);
      const response = await agent
        .patch('/api/users/me')
        .set('x-csrf-token', updateCsrfToken)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe('Updated Name');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.id).toBe(user.id);
    });

    it('should reject empty name', async () => {
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

      // Try to update with empty name
      const updateCsrfToken = await getCsrfToken(agent);
      await agent
        .patch('/api/users/me')
        .set('x-csrf-token', updateCsrfToken)
        .send({ name: '' })
        .expect(400);
    });

    it('should reject name that is too long', async () => {
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

      // Try to update with name that is too long (>100 chars)
      const updateCsrfToken = await getCsrfToken(agent);
      await agent
        .patch('/api/users/me')
        .set('x-csrf-token', updateCsrfToken)
        .send({ name: 'a'.repeat(101) })
        .expect(400);
    });

    it('should trim whitespace from name', async () => {
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

      // Update name with whitespace
      const updateCsrfToken = await getCsrfToken(agent);
      const response = await agent
        .patch('/api/users/me')
        .set('x-csrf-token', updateCsrfToken)
        .send({ name: '  Trimmed Name  ' })
        .expect(200);

      expect(response.body.user.name).toBe('Trimmed Name');
    });

    it('should write audit event for profile update', async () => {
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

      // Update name
      const updateCsrfToken = await getCsrfToken(agent);
      await agent
        .patch('/api/users/me')
        .set('x-csrf-token', updateCsrfToken)
        .send({ name: 'Updated Name' })
        .expect(200);

      // Verify audit event was created
      const dataSource = app.get<DataSource>(getDataSourceToken());
      const auditRepo = dataSource.getRepository(AuditEventEntity);
      
      const auditEvents = await auditRepo.find({
        where: {
          orgId: org.id,
          action: 'profile_updated',
          actorId: user.id,
        },
      });

      expect(auditEvents.length).toBeGreaterThan(0);
      const profileUpdateEvent = auditEvents.find(
        (e) => e.metadata && (e.metadata as any).field === 'name'
      );
      expect(profileUpdateEvent).toBeDefined();
      expect(profileUpdateEvent?.action).toBe('profile_updated');
    });

    it('should require authentication', async () => {
      const agent = getTestAgent(app);
      
      await agent
        .patch('/api/users/me')
        .send({ name: 'Updated Name' })
        .expect(401);
    });
  });
});

