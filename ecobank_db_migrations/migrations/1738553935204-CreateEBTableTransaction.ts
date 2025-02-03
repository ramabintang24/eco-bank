import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableTransaction1738553935204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "transaction"."transaction_type_enum" AS ENUM ('Deposit', 'Withdraw')
        `);
        await queryRunner.query(`
            CREATE TABLE "transaction"."eb_transaction" (
                "transaction_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "wallet_id" UUID NOT NULL,
                "total_amount" BIGINT DEFAULT 0 NOT NULL,
                "current_balance" BIGINT DEFAULT 0 NOT NULL,
                "type" "transaction"."transaction_type_enum" NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_wallet_id" FOREIGN KEY ("wallet_id") REFERENCES "transaction"."eb_wallet"("wallet_id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"."eb_transaction"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "transaction"."transaction_type_enum"`);
    }

}
