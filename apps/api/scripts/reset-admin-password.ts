import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Script to reset admin user password to match seed script (SHA256)
 * Run with: pnpm nx run api:reset-admin-password
 */
async function resetPassword() {
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

    const email = 'admin@example.com';
    const password = 'admin123';

    // Get current user
    const userResult = await client.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    const user = userResult.rows[0];
    console.log(`Found user: ${user.email}`);
    console.log(`Current hash: ${user.password_hash.substring(0, 40)}...`);

    // Create SHA256 hash (as used in seed script)
    const sha256Hash = createHash('sha256').update(password).digest('hex');
    console.log(`\nNew SHA256 hash: ${sha256Hash.substring(0, 40)}...`);

    // Update password hash
    await client.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [sha256Hash, user.id]
    );

    console.log('\n✅ Password reset successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Hash type: SHA256`);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetPassword();

