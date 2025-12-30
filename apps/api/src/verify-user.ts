import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';
import { createHash } from 'crypto';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Diagnostic script to verify user exists and test password validation
 * Run with: pnpm nx run api:verify-user
 */
async function verifyUser() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Verifying user in database...\n');

    // Find user by email
    const userResult = await client.query(
      `SELECT u.*, o.name as org_name, o.slug as org_slug 
       FROM users u 
       LEFT JOIN organizations o ON u.org_id = o.id 
       WHERE u.email = $1`,
      ['admin@example.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found: admin@example.com');
      console.log('\n📋 All users in database:');
      const allUsersResult = await client.query('SELECT id, email, org_id, role, name FROM users');
      if (allUsersResult.rows.length === 0) {
        console.log('   No users found in database.');
        console.log('\n💡 Try running: pnpm nx seed api');
      } else {
        allUsersResult.rows.forEach((u) => {
          console.log(`   - ${u.email} (ID: ${u.id}, Org: ${u.org_id})`);
        });
      }
      return;
    }

    const user = userResult.rows[0];
    console.log('✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Org ID: ${user.org_id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Password Hash: ${user.password_hash.substring(0, 40)}...`);

    if (user.org_name) {
      console.log(`   Organization: ${user.org_name} (${user.org_slug})`);
    } else if (user.org_id) {
      console.log(`   ⚠️  Organization not found for orgId: ${user.org_id}`);
    } else {
      console.log('   ⚠️  No organization ID set');
    }

    // Test password validation
    console.log('\n🔐 Testing password validation...');
    const testPassword = 'admin123';
    
    // Test SHA256 (as used in seed)
    const sha256Hash = createHash('sha256').update(testPassword).digest('hex');
    const sha256Match = sha256Hash === user.password_hash;
    console.log(`   Test password: ${testPassword}`);
    console.log(`   Stored hash: ${user.password_hash.substring(0, 40)}...`);
    console.log(`   Computed SHA256: ${sha256Hash.substring(0, 40)}...`);
    console.log(`   SHA256 match: ${sha256Match ? '✅' : '❌'}`);

    // Test bcrypt (if password was hashed with bcrypt)
    try {
      const bcrypt = await import('bcrypt');
      const bcryptMatch = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`   Bcrypt match: ${bcryptMatch ? '✅' : '❌'}`);
    } catch (error) {
      console.log(`   Bcrypt test: ⚠️  Error (${error instanceof Error ? error.message : 'unknown'})`);
    }

    console.log('\n✅ Verification complete!');
    if (!sha256Match) {
      console.log('\n⚠️  Password hash does not match! This could be the issue.');
      console.log('   The seed script uses SHA256, but the stored hash might be different.');
      console.log('   Full stored hash:', user.password_hash);
      console.log('   Full computed hash:', sha256Hash);
    }
  } catch (error) {
    console.error('❌ Error verifying user:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyUser();

