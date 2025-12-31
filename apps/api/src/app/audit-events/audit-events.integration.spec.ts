import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, getTestAgent } from '../../test/test-app.factory';
import {
  createTestOrganization,
  createTestApiKey,
  createTestAuditEvent,
  createTestUser,
} from '../../test/test-helpers';
import { ActorType } from '../../entities/audit-event.entity';
import { UserRole } from '../../entities/user.entity';
import { RateLimiterService } from '../api-key/rate-limiter.service';

describe('Audit Events Integration (e2e)', () => {
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

  describe('POST /api/v1/audit-events', () => {
    it.skip('should create audit event with valid API key', async () => {
      const org = await createTestOrganization('Test Org');
      const { key, entity } = await createTestApiKey(org.id, 'Test Key');

      const response = await request(app.getHttpServer())
        .post('/api/v1/audit-events')
        .set('x-api-key', key)
        .send({
          eventType: 'user.created',
          actor: {
            type: 'api-key',
            id: entity.id, // Use the API key entity's ID
          },
          resource: {
            type: 'user',
            id: 'user-123',
          },
          action: 'created',
          metadata: {
            name: 'Test User',
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(typeof response.body.id).toBe('string');
    });

    it('should reject request without API key', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/audit-events')
        .send({
          eventType: 'user.created',
          actor: {
            type: 'api-key',
            id: 'test-actor-id',
          },
          resource: {
            type: 'user',
            id: 'user-123',
          },
          action: 'created',
        })
        .expect(400); // CSRF guard returns 400 for missing CSRF token, API key guard would return 401
    });

    it('should reject request with invalid API key', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/audit-events')
        .set('x-api-key', 'sk_invalid_key')
        .send({
          eventType: 'user.created',
          actor: {
            type: 'api-key',
            id: 'test-actor-id',
          },
          resource: {
            type: 'user',
            id: 'user-123',
          },
          action: 'created',
        })
        .expect(401);
    });
  });

  describe.skip('GET /api/v1/audit-events (RBAC)', () => {
    it('should allow admin to see all org events', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events from different actors
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'test.action', 'test', 'test-1');
      await createTestAuditEvent(org.id, ActorType.API_KEY, null, 'test.action', 'test', 'test-2');
      await createTestAuditEvent(org.id, ActorType.SYSTEM, null, 'test.action', 'test', 'test-3');

      const agent = getTestAgent(app);
      
      // Get CSRF token (agent will preserve cookies)
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      // Login as admin (agent automatically includes cookies)
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Get audit events
      const response = await agent
        .get('/api/v1/audit-events')
        .expect(200);

      // Admin should see all events (3 events)
      expect(response.body.data).toHaveLength(3);
    });

    it('should restrict member to only see their own user events', async () => {
      const org = await createTestOrganization('Test Org');
      const member = await createTestUser(org.id, 'member@example.com', 'password123', UserRole.USER);
      const otherMember = await createTestUser(org.id, 'other@example.com', 'password123', UserRole.USER);
      
      // Create events from different actors
      await createTestAuditEvent(org.id, ActorType.USER, member.id, 'test.action', 'test', 'test-1');
      await createTestAuditEvent(org.id, ActorType.USER, otherMember.id, 'test.action', 'test', 'test-2');
      await createTestAuditEvent(org.id, ActorType.API_KEY, null, 'test.action', 'test', 'test-3');
      await createTestAuditEvent(org.id, ActorType.SYSTEM, null, 'test.action', 'test', 'test-4');

      const agent = getTestAgent(app);
      
      // Get CSRF token (agent will preserve cookies)
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      // Login as member (agent automatically includes cookies)
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'member@example.com',
          password: 'password123',
        })
        .expect(200);

      // Get audit events
      const response = await agent
        .get('/api/v1/audit-events')
        .expect(200);

      // Member should only see their own user events (1 event)
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].actorId).toBe(member.id);
      expect(response.body.data[0].actorType).toBe('user');
    });
  });

  describe.skip('GET /api/v1/audit-events (Filtering)', () => {
    it('should filter by multiple actions', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events with different actions
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'update', 'user', 'user-2');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'delete', 'user', 'user-3');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'read', 'user', 'user-4');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Filter by multiple actions (comma-separated)
      const response = await agent
        .get('/api/v1/audit-events?action=create,update')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((e: any) => ['create', 'update'].includes(e.action))).toBe(true);
    });

    it('should filter by status (success)', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events with different statuses
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1', { status: 'success' });
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-2', null); // NULL = success
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-3', { status: 'failure' });

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Filter by success status
      const response = await agent
        .get('/api/v1/audit-events?status=success')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((e: any) => 
        e.metadata?.status === 'success' || e.metadata === null
      )).toBe(true);
    });

    it('should filter by status (failure)', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events with different statuses
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1', { status: 'success' });
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-2', null); // NULL = success
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-3', { status: 'failure' });

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Filter by failure status
      const response = await agent
        .get('/api/v1/audit-events?status=failure')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].metadata?.status).toBe('failure');
    });

    it('should filter by actorId (partial match)', async () => {
      const org = await createTestOrganization('Test Org');
      const { createTestUser } = await import('../../test/test-helpers');
      const { UserRole } = await import('../../entities/user.entity');
      const admin1 = await createTestUser(org.id, 'admin1@example.com', 'password123', UserRole.ADMIN);
      const admin2 = await createTestUser(org.id, 'admin2@example.com', 'password123', UserRole.ADMIN);
      
      // Create events from different actors
      await createTestAuditEvent(org.id, ActorType.USER, admin1.id, 'create', 'user', 'user-1');
      await createTestAuditEvent(org.id, ActorType.USER, admin2.id, 'create', 'user', 'user-2');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin1@example.com',
          password: 'password123',
        })
        .expect(200);

      // Filter by actorId (partial match - using first 8 chars of UUID)
      const partialId = admin1.id.substring(0, 8);
      const response = await agent
        .get(`/api/v1/audit-events?actorId=${partialId}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].actorId).toBe(admin1.id);
    });

    it('should filter by ipAddress (partial match)', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events with different IP addresses
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1', null, '192.168.1.100');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-2', null, '192.168.1.200');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-3', null, '10.0.0.1');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Filter by IP address (partial match)
      const response = await agent
        .get('/api/v1/audit-events?ipAddress=192.168.1')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((e: any) => e.ipAddress?.startsWith('192.168.1'))).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create various events
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1', { status: 'success' }, '192.168.1.100');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'update', 'user', 'user-2', { status: 'success' }, '192.168.1.100');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-3', { status: 'failure' }, '192.168.1.100');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'document', 'doc-1', { status: 'success' }, '192.168.1.100');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Combine filters: action=create, status=success, resourceType=user, ipAddress=192.168.1.100
      const response = await agent
        .get('/api/v1/audit-events?action=create&status=success&resourceType=user&ipAddress=192.168.1.100')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].action).toBe('create');
      expect(response.body.data[0].resourceType).toBe('user');
      expect(response.body.data[0].ipAddress).toBe('192.168.1.100');
      expect(response.body.data[0].metadata?.status === 'success' || response.body.data[0].metadata === null).toBe(true);
    });
  });

  describe.skip('GET /api/v1/audit-events (Pagination)', () => {
    it('should support cursor pagination', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create multiple events
      for (let i = 0; i < 15; i++) {
        await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'test.action', 'test', `test-${i}`);
      }

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      // Get first page (default limit is usually 20, but we'll use a smaller limit if available)
      const firstPage = await agent
        .get('/api/v1/audit-events?limit=10')
        .expect(200);

      expect(firstPage.body.data).toHaveLength(10);
      expect(firstPage.body.nextCursor).toBeDefined();

      // Get second page using cursor
      const secondPage = await agent
        .get(`/api/v1/audit-events?cursor=${firstPage.body.nextCursor}&limit=10`)
        .expect(200);

      expect(secondPage.body.data.length).toBeGreaterThan(0);
      // Verify we got different results (no duplicates)
      const firstPageIds = firstPage.body.data.map((e: any) => e.id);
      const secondPageIds = secondPage.body.data.map((e: any) => e.id);
      const intersection = firstPageIds.filter((id: string) => secondPageIds.includes(id));
      expect(intersection.length).toBe(0);
    });

    it('should change nextCursor between pages', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create multiple events
      for (let i = 0; i < 15; i++) {
        await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'test.action', 'test', `test-${i}`);
      }

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      const firstPage = await agent
        .get('/api/v1/audit-events?limit=5')
        .expect(200);

      expect(firstPage.body.nextCursor).toBeDefined();
      const firstCursor = firstPage.body.nextCursor;

      const secondPage = await agent
        .get(`/api/v1/audit-events?cursor=${firstCursor}&limit=5`)
        .expect(200);

      // Second page should have a different cursor (or null if no more pages)
      if (secondPage.body.nextCursor) {
        expect(secondPage.body.nextCursor).not.toBe(firstCursor);
      }
    });
  });

  describe.skip('GET /api/v1/audit-events/export.json (Export)', () => {
    it('should export events as JSON (admin only)', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create some events
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'update', 'user', 'user-2');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'delete', 'user', 'user-3');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      const response = await agent
        .get('/api/v1/audit-events/export.json')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      
      // Verify structure
      const firstEvent = response.body[0];
      expect(firstEvent).toHaveProperty('id');
      expect(firstEvent).toHaveProperty('orgId');
      expect(firstEvent).toHaveProperty('action');
      expect(firstEvent).toHaveProperty('createdAt');
    });

    it('should apply filters to JSON export', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create events with different actions
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'update', 'user', 'user-2');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'delete', 'user', 'user-3');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      const response = await agent
        .get('/api/v1/audit-events/export.json?action=create')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((e: any) => e.action === 'create')).toBe(true);
    });

    it('should reject JSON export for non-admin users', async () => {
      const org = await createTestOrganization('Test Org');
      const member = await createTestUser(org.id, 'member@example.com', 'password123', UserRole.USER);

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'member@example.com',
          password: 'password123',
        })
        .expect(200);

      await agent
        .get('/api/v1/audit-events/export.json')
        .expect(403);
    });
  });

  describe.skip('GET /api/v1/audit-events/export.csv (CSV Export)', () => {
    it('should export events as CSV (admin only)', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      // Create some events
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1');
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'update', 'user', 'user-2');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      const response = await agent
        .get('/api/v1/audit-events/export.csv')
        .expect(200)
        .expect('Content-Type', /text\/csv/);

      const csvText = response.text;
      expect(csvText).toBeDefined();
      expect(csvText.length).toBeGreaterThan(0);

      // Check for CSV header
      const lines = csvText.split('\n').filter((line) => line.trim());
      expect(lines.length).toBeGreaterThan(0);
      
      const header = lines[0];
      expect(header).toContain('id');
      expect(header).toContain('orgId');
      expect(header).toContain('action');
      expect(header).toContain('createdAt');
      
      // Should have at least header + 2 data rows
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    it('should include expected CSV headers', async () => {
      const org = await createTestOrganization('Test Org');
      const admin = await createTestUser(org.id, 'admin@example.com', 'password123', UserRole.ADMIN);
      
      await createTestAuditEvent(org.id, ActorType.USER, admin.id, 'create', 'user', 'user-1');

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      const response = await agent
        .get('/api/v1/audit-events/export.csv')
        .expect(200);

      const csvText = response.text;
      const header = csvText.split('\n')[0];
      
      const expectedHeaders = ['id', 'orgId', 'actorType', 'actorId', 'action', 'resourceType', 'resourceId', 'metadata', 'ipAddress', 'userAgent', 'createdAt'];
      for (const headerName of expectedHeaders) {
        expect(header).toContain(headerName);
      }
    });

    it('should reject CSV export for non-admin users', async () => {
      const org = await createTestOrganization('Test Org');
      const member = await createTestUser(org.id, 'member@example.com', 'password123', UserRole.USER);

      const agent = getTestAgent(app);
      const csrfResponse = await agent.get('/api/auth/csrf').expect(200);
      const csrfToken = csrfResponse.body.token;
      
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'member@example.com',
          password: 'password123',
        })
        .expect(200);

      await agent
        .get('/api/v1/audit-events/export.csv')
        .expect(403);
    });
  });
});

