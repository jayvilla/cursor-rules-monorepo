import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';
import { createHash, randomBytes } from 'crypto';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if seed data already exists
    const existingOrg = await client.query(
      `SELECT id FROM organizations WHERE slug = $1`,
      ['default-org']
    );

    if (existingOrg.rows.length > 0) {
      console.log('⚠️  Seed data already exists. Skipping seed.');
      return;
    }

    // 1. Create organization
    console.log('📦 Creating organization...');
    const orgResult = await client.query(
      `INSERT INTO organizations (name, slug) VALUES ($1, $2) RETURNING id, name`,
      ['Default Organization', 'default-org']
    );
    const orgId = orgResult.rows[0].id;
    console.log(`✅ Created organization: ${orgResult.rows[0].name} (${orgId})`);

    // 2. Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // In production, use a strong password!
    const passwordHash = createHash('sha256').update(adminPassword).digest('hex');

    const userResult = await client.query(
      `INSERT INTO users (org_id, email, password_hash, role, name)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email`,
      [orgId, adminEmail, passwordHash, 'admin', 'Admin User']
    );
    const userId = userResult.rows[0].id;
    console.log(`✅ Created admin user: ${adminEmail} (${userId})`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // 3. Create API key
    console.log('🔑 Creating API key...');
    const rawApiKey = `sk_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawApiKey).digest('hex');

    const apiKeyResult = await client.query(
      `INSERT INTO api_keys (org_id, name, key_hash, last_used_at)
       VALUES ($1, $2, $3, $4) RETURNING id, name`,
      [orgId, 'Default API Key', keyHash, null]
    );
    const apiKeyId = apiKeyResult.rows[0].id;
    console.log(`✅ Created API key: ${apiKeyResult.rows[0].name} (${apiKeyId})`);
    console.log(`   Raw Key: ${rawApiKey}`);
    console.log(`   ⚠️  Store this key securely! It won't be shown again.`);

    // 4. Create sample audit events
    console.log('\n📊 Creating sample audit events...');
    const now = new Date();
    const events = [
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'created',
        resourceType: 'organization',
        resourceId: orgId,
        metadata: JSON.stringify({ name: 'Default Organization', slug: 'default-org' }),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'created',
        resourceType: 'user',
        resourceId: userId,
        metadata: JSON.stringify({ email: adminEmail, role: 'admin', name: 'Admin User' }),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'created',
        resourceType: 'api-key',
        resourceId: apiKeyId,
        metadata: JSON.stringify({ name: 'Default API Key' }),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'login',
        resourceType: 'session',
        resourceId: `session-${randomBytes(16).toString('hex')}`,
        metadata: JSON.stringify({ method: 'password', success: true }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'viewed',
        resourceType: 'audit-log',
        resourceId: 'audit-logs-page',
        metadata: JSON.stringify({ filters: { limit: 50 } }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        orgId,
        actorType: 'api-key',
        actorId: apiKeyId,
        action: 'created',
        resourceType: 'audit-event',
        resourceId: `event-${randomBytes(16).toString('hex')}`,
        metadata: JSON.stringify({ 
          eventType: 'user.action',
          source: 'external-api',
          clientVersion: '1.0.0'
        }),
        ipAddress: '203.0.113.42',
        userAgent: 'MyApp/1.0.0',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'updated',
        resourceType: 'user',
        resourceId: userId,
        metadata: JSON.stringify({ field: 'name', oldValue: 'Admin', newValue: 'Admin User' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'exported',
        resourceType: 'audit-log',
        resourceId: `export-${randomBytes(16).toString('hex')}`,
        metadata: JSON.stringify({ format: 'csv', recordCount: 7, dateRange: 'last-7-days' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        orgId,
        actorType: 'system',
        actorId: null,
        action: 'started',
        resourceType: 'system',
        resourceId: 'webhook-worker',
        metadata: JSON.stringify({ version: '1.0.0', environment: 'development' }),
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        orgId,
        actorType: 'user',
        actorId: userId,
        action: 'login',
        resourceType: 'session',
        resourceId: `session-${randomBytes(16).toString('hex')}`,
        metadata: JSON.stringify({ method: 'password', success: true }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ];

    for (const event of events) {
      await client.query(
        `INSERT INTO audit_events (org_id, actor_type, actor_id, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          event.orgId,
          event.actorType,
          event.actorId,
          event.action,
          event.resourceType,
          event.resourceId,
          event.metadata,
          event.ipAddress,
          event.userAgent,
          event.createdAt,
        ]
      );
    }
    console.log(`✅ Created ${events.length} sample audit events`);

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Organization: Default Organization`);
    console.log(`   Admin User: ${adminEmail}`);
    console.log(`   API Key: ${rawApiKey.substring(0, 20)}...`);
    console.log(`   Audit Events: ${events.length} sample events created`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

