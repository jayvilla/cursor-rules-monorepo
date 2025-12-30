import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';
import { createHash } from 'crypto';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Script to find and fix duplicate users
 * Run with: pnpm exec tsx apps/api/src/fix-duplicate-users.ts
 */
async function fixDuplicates() {
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

    // Find all users with admin@example.com
    const usersResult = await client.query(
      `SELECT u.id, u.email, u.password_hash, u.org_id, u.role, u.name, u.created_at
       FROM users u 
       WHERE u.email = $1
       ORDER BY u.created_at`,
      ['admin@example.com']
    );

    if (usersResult.rows.length === 0) {
      console.log('❌ No users found with email: admin@example.com');
      return;
    }

    console.log(`Found ${usersResult.rows.length} user(s) with email admin@example.com:\n`);

    usersResult.rows.forEach((user, index) => {
      const hashType = user.password_hash.startsWith('$2') ? 'bcrypt' : 'SHA256';
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Hash type: ${hashType}`);
      console.log(`  Hash: ${user.password_hash.substring(0, 40)}...`);
      console.log(`  Org ID: ${user.org_id}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Created: ${user.created_at}`);
      console.log('');
    });

    if (usersResult.rows.length > 1) {
      console.log('⚠️  Multiple users found! Keeping the first one (oldest) and deleting others...\n');
      
      // Keep the first user (oldest), delete the rest
      const userToKeep = usersResult.rows[0];
      const usersToDelete = usersResult.rows.slice(1);

      for (const userToDelete of usersToDelete) {
        console.log(`Deleting user: ${userToDelete.id}`);
        await client.query('DELETE FROM users WHERE id = $1', [userToDelete.id]);
      }

      // Update the kept user to have SHA256 hash if it doesn't already
      if (userToKeep.password_hash.startsWith('$2')) {
        console.log(`\nUpdating kept user to use SHA256 hash...`);
        const password = 'admin123';
        const sha256Hash = createHash('sha256').update(password).digest('hex');
        await client.query(
          'UPDATE users SET password_hash = $1 WHERE id = $2',
          [sha256Hash, userToKeep.id]
        );
        console.log('✅ Updated password hash to SHA256');
      }

      console.log('\n✅ Duplicate users removed!');
    } else {
      // Single user - just update to SHA256 if needed
      const user = usersResult.rows[0];
      if (user.password_hash.startsWith('$2')) {
        console.log('Updating user to use SHA256 hash...');
        const password = 'admin123';
        const sha256Hash = createHash('sha256').update(password).digest('hex');
        await client.query(
          'UPDATE users SET password_hash = $1 WHERE id = $2',
          [sha256Hash, user.id]
        );
        console.log('✅ Updated password hash to SHA256');
      } else {
        console.log('✅ User already has SHA256 hash');
      }
    }
  } catch (error) {
    console.error('❌ Error fixing duplicates:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixDuplicates();

