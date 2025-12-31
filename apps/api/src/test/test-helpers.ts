import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OrganizationEntity } from '../entities/organization.entity';
import { UserEntity, UserRole } from '../entities/user.entity';
import { ApiKeyEntity } from '../entities/api-key.entity';
import { AuditEventEntity, ActorType } from '../entities/audit-event.entity';

// Get the DataSource from the test app if available, otherwise fall back to setup DataSource
function getDataSourceForTests(): DataSource {
  // Try to get the DataSource from the test app (set by test-app.factory)
  const appDataSource = (global as any).__TEST_APP_DATA_SOURCE__;
  if (appDataSource && appDataSource.isInitialized) {
    return appDataSource;
  }
  // Fallback to test setup DataSource
  const { getTestDataSource } = require('./setup');
  const setupDataSource = getTestDataSource();
  if (!appDataSource) {
    console.warn('⚠️  Using setup DataSource instead of app DataSource - this may cause data visibility issues!');
  } else if (!appDataSource.isInitialized) {
    console.warn('⚠️  App DataSource exists but is not initialized - using setup DataSource');
  }
  return setupDataSource;
}

// Helper to ensure data is committed and visible
async function ensureDataCommitted(dataSource: DataSource): Promise<void> {
  // Since we're using max: 1 connection pool, all queries use the same connection
  // TypeORM's save() method auto-commits, but we need to ensure the connection
  // has processed the commit before other queries can see it.
  // We do this by executing queries that force the connection to sync with the database.
  try {
    // Execute a simple query to force a round-trip and ensure connection state is synced
    await dataSource.query('SELECT 1');
    // Small delay to ensure PostgreSQL has fully processed the commit
    // Use a longer delay in tests to ensure visibility across connections
    await new Promise(resolve => setTimeout(resolve, 50));
  } catch (error) {
    // If query fails, that's okay - continue anyway
  }
}

export async function createTestOrganization(
  name: string = 'Test Org',
): Promise<OrganizationEntity> {
  const dataSource = getDataSourceForTests();
  // Always use DataSource repository to ensure we're using the same connection
  // The app's repository might be using a different connection context
  const orgRepo = dataSource.getRepository(OrganizationEntity);
  
  const org = orgRepo.create({ name, slug: name.toLowerCase().replace(/\s+/g, '-') });
  const saved = await orgRepo.save(org);
  
  // Ensure data is committed and visible
  await ensureDataCommitted(dataSource);
  
  return saved;
}

export async function createTestUser(
  orgId: string,
  email: string,
  password: string = 'password123',
  role: UserRole = UserRole.USER,
): Promise<UserEntity> {
  const dataSource = getDataSourceForTests();
  const userRepo = dataSource.getRepository(UserEntity);
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepo.create({
    orgId,
    email,
    passwordHash,
    role,
    name: email.split('@')[0],
  });
  const saved = await userRepo.save(user);
  
  // Ensure data is committed and visible
  // Since we're using max: 1 connection pool, all operations use the same connection
  // But we need to ensure the connection has processed the commit
  await ensureDataCommitted(dataSource);
  
  return saved;
}

export async function createTestApiKey(
  orgId: string,
  name: string = 'Test API Key',
  apiKey?: string,
): Promise<{ entity: ApiKeyEntity; key: string }> {
  const dataSource = getDataSourceForTests();
  const apiKeyRepo = dataSource.getRepository(ApiKeyEntity);
  
  // Generate API key if not provided
  if (!apiKey) {
    apiKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
  }
  
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const keyPrefix = apiKey.substring(0, 8); // First 8 characters
  const entity = apiKeyRepo.create({
    orgId,
    name,
    keyHash,
    keyPrefix,
  });
  const saved = await apiKeyRepo.save(entity);
  
  // Ensure data is committed and visible
  await ensureDataCommitted(dataSource);
  
  return { entity: saved, key: apiKey };
}

export async function createTestAuditEvent(
  orgId: string,
  actorType: ActorType = ActorType.USER,
  actorId?: string,
  action: string = 'test.action',
  resourceType: string = 'test',
  resourceId: string = 'test-id',
  metadata?: Record<string, any> | null,
  ipAddress?: string | null,
  userAgent?: string | null,
): Promise<AuditEventEntity> {
  const dataSource = getDataSourceForTests();
  const auditRepo = dataSource.getRepository(AuditEventEntity);
  
  const event = auditRepo.create({
    orgId,
    actorType,
    actorId: actorId || null,
    action,
    resourceType,
    resourceId,
    metadata: metadata !== undefined ? metadata : null,
    ipAddress: ipAddress !== undefined ? ipAddress : null,
    userAgent: userAgent !== undefined ? userAgent : null,
  });
  const saved = await auditRepo.save(event);
  
  // Ensure data is committed and visible
  await ensureDataCommitted(dataSource);
  
  return saved;
}

/**
 * Helper to get CSRF token using a supertest agent
 * This ensures cookies are preserved across requests
 */
export async function getCsrfToken(agent: any): Promise<string> {
  const response = await agent.get('/api/auth/csrf').expect(200);
  return response.body.token;
}

/**
 * Helper to perform a mutating request with CSRF protection
 * Fetches CSRF token first, then performs the request with credentials
 */
export async function requestWithCsrf(
  agent: any,
  method: 'post' | 'patch' | 'put' | 'delete',
  path: string,
  data?: any,
): Promise<any> {
  const csrfToken = await getCsrfToken(agent);
  const req = agent[method](path).set('x-csrf-token', csrfToken);
  
  if (data) {
    req.send(data);
  }
  
  return req;
}

