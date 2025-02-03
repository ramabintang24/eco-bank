import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableBankFinance1737640997861 implements MigrationInterface {
    name = 'CreateEBTableBankFinance1737640997861';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "transaction"`);

        await queryRunner.query(`
            CREATE TYPE "transaction"."finance_type_enum" AS ENUM ('Income', 'Expenses')
        `);

        await queryRunner.query(`
            CREATE TABLE "finance"."eb_bank_finance" (
                "finance_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "user_id" UUID NOT NULL,
                "transaction_id" UUID NOT NULL,
                "amount" BIGINT DEFAULT 0 NOT NULL,
                "type" "transaction"."finance_type_enum" NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."eb_user"("user_id") ON DELETE CASCADE,
                CONSTRAINT "FK_transaction_id" FOREIGN KEY ("transaction_id") REFERENCES "transaction"."eb_transaction"("transaction_id") ON DELETE CASCADE,

            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "finance"."eb_bank_finance"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "finance"`);
    }
}
