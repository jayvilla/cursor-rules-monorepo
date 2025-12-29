import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1735506000000 implements MigrationInterface {
  name = 'InitialSchema1735506000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not exists
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user');
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."audit_events_actor_type_enum" AS ENUM('user', 'api_key', 'system');
    `);

    // Create organizations table
    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
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
      )
    `);

    // Create api_keys table
    await queryRunner.query(`
      CREATE TABLE "api_keys" (
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
      )
    `);

    // Create audit_events table
    await queryRunner.query(`
      CREATE TABLE "audit_events" (
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
      )
    `);

    // Create indexes for audit_events
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_events_org_created" ON "audit_events" ("org_id", "created_at" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_events_org_action" ON "audit_events" ("org_id", "action")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_events_org_resource" ON "audit_events" ("org_id", "resource_type", "resource_id")
    `);

    // Create webhooks table
    await queryRunner.query(`
      CREATE TABLE "webhooks" (
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
      )
    `);

    // Create webhook_deliveries table
    await queryRunner.query(`
      CREATE TABLE "webhook_deliveries" (
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
      )
    `);

    // Create index for webhook_deliveries
    await queryRunner.query(`
      CREATE INDEX "IDX_webhook_deliveries_webhook_created" ON "webhook_deliveries" ("webhook_id", "created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_webhook_deliveries_webhook_created"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_events_org_resource"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_events_org_action"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_events_org_created"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "webhook_deliveries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "webhooks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "api_keys"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "organizations"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."audit_events_actor_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
  }
}

