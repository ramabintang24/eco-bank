import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableItem1737640997861 implements MigrationInterface {
    name = 'CreateEBTableItem1737640997861';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "transaction"`);

        await queryRunner.query(`
            CREATE TABLE "transaction"."eb_item" (
                "item_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "unit" BIGINT DEFAULT 0 NOT NULL,
                "purchase_price" BIGINT DEFAULT 0 NOT NULL,
                "selling_price" BIGINT DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP WITH TIME ZONE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"."eb_item"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "transaction"`);
    }
}
