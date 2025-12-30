import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import {
  OrganizationEntity,
  UserEntity,
  ApiKeyEntity,
  AuditEventEntity,
  UserRole,
  ActorType,
} from './entities';

/**
 * Seed script for populating initial database data.
 * Run with: pnpm nx run api:seed
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(getDataSourceToken());

  try {
    console.log('🌱 Starting database seed...');

    const orgRepository = dataSource.getRepository(OrganizationEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const apiKeyRepository = dataSource.getRepository(ApiKeyEntity);
    const auditEventRepository = dataSource.getRepository(AuditEventEntity);

    // Check if seed data already exists
    const existingOrg = await orgRepository.findOne({
      where: { slug: 'default-org' },
    });

    if (existingOrg) {
      console.log('⚠️  Seed data already exists. Skipping seed.');
      return;
    }

    // 1. Create organization
    console.log('📦 Creating organization...');
    const organization = orgRepository.create({
      name: 'Default Organization',
      slug: 'default-org',
    });
    const savedOrg = await orgRepository.save(organization);
    console.log(`✅ Created organization: ${savedOrg.name} (${savedOrg.id})`);

    // 2. Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // In production, use a strong password!
    const passwordHash = createHash('sha256')
      .update(adminPassword)
      .digest('hex'); // In production, use bcrypt or argon2

    const adminUser = userRepository.create({
      orgId: savedOrg.id,
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      name: 'Admin User',
    });
    const savedUser = await userRepository.save(adminUser);
    console.log(`✅ Created admin user: ${savedUser.email} (${savedUser.id})`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // 3. Create API key
    console.log('🔑 Creating API key...');
    const rawApiKey = `sk_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawApiKey).digest('hex');

    const apiKey = apiKeyRepository.create({
      orgId: savedOrg.id,
      name: 'Default API Key',
      keyHash,
      lastUsedAt: null,
    });
    const savedApiKey = await apiKeyRepository.save(apiKey);
    console.log(`✅ Created API key: ${savedApiKey.name} (${savedApiKey.id})`);
    console.log(`   Raw Key: ${rawApiKey}`);
    console.log(`   ⚠️  Store this key securely! It won't be shown again.`);

    // 4. Create sample audit events
    console.log('\n📊 Creating sample audit events...');
    const now = new Date();
    const events = [
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'created',
        resourceType: 'organization',
        resourceId: savedOrg.id,
        metadata: { name: savedOrg.name, slug: savedOrg.slug },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'created',
        resourceType: 'user',
        resourceId: savedUser.id,
        metadata: { email: adminEmail, role: 'admin', name: 'Admin User' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'created',
        resourceType: 'api-key',
        resourceId: savedApiKey.id,
        metadata: { name: savedApiKey.name },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'login',
        resourceType: 'session',
        resourceId: `session-${randomBytes(16).toString('hex')}`,
        metadata: { method: 'password', success: true },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'viewed',
        resourceType: 'audit-log',
        resourceId: 'audit-logs-page',
        metadata: { filters: { limit: 50 } },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.API_KEY,
        actorId: savedApiKey.id,
        action: 'created',
        resourceType: 'audit-event',
        resourceId: `event-${randomBytes(16).toString('hex')}`,
        metadata: {
          eventType: 'user.action',
          source: 'external-api',
          clientVersion: '1.0.0',
        },
        ipAddress: '203.0.113.42',
        userAgent: 'MyApp/1.0.0',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'updated',
        resourceType: 'user',
        resourceId: savedUser.id,
        metadata: { field: 'name', oldValue: 'Admin', newValue: 'Admin User' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'exported',
        resourceType: 'audit-log',
        resourceId: `export-${randomBytes(16).toString('hex')}`,
        metadata: { format: 'csv', recordCount: 7, dateRange: 'last-7-days' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.SYSTEM,
        actorId: null,
        action: 'started',
        resourceType: 'system',
        resourceId: 'webhook-worker',
        metadata: { version: '1.0.0', environment: 'development' },
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        orgId: savedOrg.id,
        actorType: ActorType.USER,
        actorId: savedUser.id,
        action: 'login',
        resourceType: 'session',
        resourceId: `session-${randomBytes(16).toString('hex')}`,
        metadata: { method: 'password', success: true },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ];

    for (const eventData of events) {
      const event = auditEventRepository.create(eventData);
      await auditEventRepository.save(event);
    }
    console.log(`✅ Created ${events.length} sample audit events`);

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Organization: ${savedOrg.name}`);
    console.log(`   Admin User: ${adminEmail}`);
    console.log(`   API Key: ${rawApiKey.substring(0, 20)}...`);
    console.log(`   Audit Events: ${events.length} sample events created`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
    await dataSource.destroy();
  }
}

bootstrap();

