import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWebhookDeliveryRetryFields1735600000000 implements MigrationInterface {
  name = 'AddWebhookDeliveryRetryFields1735600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add attempts column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'webhook_deliveries' AND column_name = 'attempts'
        ) THEN
          ALTER TABLE "webhook_deliveries"
          ADD COLUMN "attempts" integer NOT NULL DEFAULT 0;
        END IF;
      END $$;
    `);

    // Add next_retry_at column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'webhook_deliveries' AND column_name = 'next_retry_at'
        ) THEN
          ALTER TABLE "webhook_deliveries"
          ADD COLUMN "next_retry_at" TIMESTAMP;
        END IF;
      END $$;
    `);

    // Create index for pending deliveries with next_retry_at if it doesn't exist
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_webhook_deliveries_pending_retry" 
      ON "webhook_deliveries" ("status", "next_retry_at")
      WHERE "status" = 'pending'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_webhook_deliveries_pending_retry"
    `);

    // Remove columns
    await queryRunner.query(`
      ALTER TABLE "webhook_deliveries"
      DROP COLUMN IF EXISTS "next_retry_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "webhook_deliveries"
      DROP COLUMN IF EXISTS "attempts"
    `);
  }
}

