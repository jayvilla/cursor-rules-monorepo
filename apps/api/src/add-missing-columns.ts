import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Script to add missing columns from migrations that weren't run
 * Run with: pnpm exec tsx apps/api/src/add-missing-columns.ts
 */
async function addMissingColumns() {
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

    // Check if key_prefix column exists
    const checkApiKeysResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='api_keys' AND column_name='key_prefix'
    `);

    if (checkApiKeysResult.rows.length === 0) {
      console.log('📦 Adding key_prefix column to api_keys table...');
      await client.query(`
        ALTER TABLE "api_keys"
        ADD COLUMN "key_prefix" character varying(16)
      `);
      console.log('✅ Added key_prefix column to api_keys table\n');
    } else {
      console.log('✅ key_prefix column already exists in api_keys table\n');
    }

    // Check if attempts column exists
    const checkAttemptsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='webhook_deliveries' AND column_name='attempts'
    `);

    if (checkAttemptsResult.rows.length === 0) {
      console.log('📦 Adding attempts column to webhook_deliveries table...');
      await client.query(`
        ALTER TABLE "webhook_deliveries"
        ADD COLUMN "attempts" integer NOT NULL DEFAULT 0
      `);
      console.log('✅ Added attempts column to webhook_deliveries table');
    } else {
      console.log('✅ attempts column already exists in webhook_deliveries table');
    }

    // Check if next_retry_at column exists
    const checkNextRetryAtResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='webhook_deliveries' AND column_name='next_retry_at'
    `);

    if (checkNextRetryAtResult.rows.length === 0) {
      console.log('📦 Adding next_retry_at column to webhook_deliveries table...');
      await client.query(`
        ALTER TABLE "webhook_deliveries"
        ADD COLUMN "next_retry_at" TIMESTAMP
      `);
      console.log('✅ Added next_retry_at column to webhook_deliveries table');
    } else {
      console.log('✅ next_retry_at column already exists in webhook_deliveries table');
    }

    // Create index for pending deliveries with next_retry_at (if columns exist)
    console.log('📦 Creating index for pending webhook deliveries...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_webhook_deliveries_pending_retry" 
      ON "webhook_deliveries" ("status", "next_retry_at")
      WHERE "status" = 'pending'
    `);
    console.log('✅ Index created (or already exists)\n');

    console.log('✅ All missing columns have been added!');
  } catch (error) {
    console.error('❌ Error adding columns:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMissingColumns();

