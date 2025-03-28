import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBDetailTransaction1743060697416 implements MigrationInterface {
    name = 'UpdateEBDetailTransaction1743060697416';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            ADD COLUMN "item_name" VARCHAR(255) NOT NULL,
            ADD COLUMN "purchase_price" BIGINT DEFAULT 0 NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            DROP COLUMN IF EXISTS "item_name",
            DROP COLUMN IF EXISTS "purchase_price";
        `);
    }

}
