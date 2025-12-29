import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runMigration() {
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

    console.log('📦 Running migration: InitialSchema');

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Run the migration SQL directly
    const migrationSQL = `
      -- Create enum types
      DO $$ BEGIN
        CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."audit_events_actor_type_enum" AS ENUM('user', 'api_key', 'system');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Create organizations table
      CREATE TABLE IF NOT EXISTS "organizations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
      );

      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "org_id" uuid NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "name" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_org_email" UNIQUE ("org_id", "email"),
        CONSTRAINT "FK_users_org" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      );

      -- Create api_keys table
      CREATE TABLE IF NOT EXISTS "api_keys" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "org_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "key_hash" character varying(255) NOT NULL,
        "last_used_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_api_keys" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_api_keys_key_hash" UNIQUE ("key_hash"),
        CONSTRAINT "FK_api_keys_org" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      );

      -- Create audit_events table
      CREATE TABLE IF NOT EXISTS "audit_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "org_id" uuid NOT NULL,
        "actor_type" "public"."audit_events_actor_type_enum" NOT NULL,
        "actor_id" uuid,
        "action" character varying(255) NOT NULL,
        "resource_type" character varying(255) NOT NULL,
        "resource_id" character varying(255) NOT NULL,
        "metadata" jsonb,
        "ip_address" character varying(45),
        "user_agent" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_events" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_events_org" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      );

      -- Create indexes for audit_events
      CREATE INDEX IF NOT EXISTS "IDX_audit_events_org_created" ON "audit_events" ("org_id", "created_at" DESC);
      CREATE INDEX IF NOT EXISTS "IDX_audit_events_org_action" ON "audit_events" ("org_id", "action");
      CREATE INDEX IF NOT EXISTS "IDX_audit_events_org_resource" ON "audit_events" ("org_id", "resource_type", "resource_id");

      -- Create webhooks table
      CREATE TABLE IF NOT EXISTS "webhooks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "org_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "url" text NOT NULL,
        "secret" text,
        "status" character varying(50) NOT NULL DEFAULT 'active',
        "events" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_webhooks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_webhooks_org" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      );

      -- Create webhook_deliveries table
      CREATE TABLE IF NOT EXISTS "webhook_deliveries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "webhook_id" uuid NOT NULL,
        "payload" text NOT NULL,
        "status_code" integer,
        "response" text,
        "attempted_at" TIMESTAMP NOT NULL,
        "completed_at" TIMESTAMP,
        "status" character varying(50) NOT NULL DEFAULT 'pending',
        "error" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_webhook_deliveries" PRIMARY KEY ("id"),
        CONSTRAINT "FK_webhook_deliveries_webhook" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE
      );

      -- Create index for webhook_deliveries
      CREATE INDEX IF NOT EXISTS "IDX_webhook_deliveries_webhook_created" ON "webhook_deliveries" ("webhook_id", "created_at");
    `;

    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully');

    // Create migrations table for TypeORM
    await client.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL PRIMARY KEY,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL
      );
    `);

    // Record migration
    await client.query(`
      INSERT INTO "migrations" ("timestamp", "name")
      VALUES (1735506000000, 'InitialSchema1735506000000')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Migration recorded');
  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

