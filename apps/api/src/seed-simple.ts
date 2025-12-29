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

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Organization: Default Organization`);
    console.log(`   Admin User: ${adminEmail}`);
    console.log(`   API Key: ${rawApiKey.substring(0, 20)}...`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

