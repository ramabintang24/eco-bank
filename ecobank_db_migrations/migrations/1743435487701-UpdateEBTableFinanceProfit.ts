import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBTableFinanceProfit1743435487701 implements MigrationInterface {
    name = 'UpdateEBTableFinanceProfit1743435487701 ';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_bank_finance"
            ADD COLUMN "profit" BIGINT DEFAULT 0 NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_bank_finance"
            DROP COLUMN IF EXISTS "profit";
        `);
    }

}
