import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import {
  OrganizationEntity,
  UserEntity,
  ApiKeyEntity,
  UserRole,
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

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Organization: ${savedOrg.name}`);
    console.log(`   Admin User: ${adminEmail}`);
    console.log(`   API Key: ${rawApiKey.substring(0, 20)}...`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
    await dataSource.destroy();
  }
}

bootstrap();

