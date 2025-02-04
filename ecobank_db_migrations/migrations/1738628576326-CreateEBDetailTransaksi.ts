import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBDetailTransaksi1738628576326 implements MigrationInterface {
    name = 'CreateEBDetailTransaksi1738628576326';


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "transaction"`);

        await queryRunner.query(`
            CREATE TABLE "transaction"."eb_detail_transaction" (
                "detail_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "transaction_id" UUID NOT NULL,
                "item_id" UUID NOT NULL,
                "unit" BIGINT DEFAULT 0 NOT NULL,
                "sub_total" BIGINT DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_transaction_id" FOREIGN KEY ("transaction_id") REFERENCES "transaction"."eb_transaction"("transaction_id") ON DELETE CASCADE,
                CONSTRAINT "FK_item_id" FOREIGN KEY ("item_id") REFERENCES "transaction"."eb_item"("item_id") ON DELETE CASCADE

            )
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"."eb_detail_transaction"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "transaction"`);
    }

}
