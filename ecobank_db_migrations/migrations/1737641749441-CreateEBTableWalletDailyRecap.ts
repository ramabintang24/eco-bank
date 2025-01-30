import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableWalletDailyRecap1737641749441 implements MigrationInterface {

    name = 'CreateEBTableWalletDailyRecap1737641749441';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transaction"."eb_wallet_daily_recap" (
                "wallet_id" UUID NOT NULL,
                "date" DATE NOT NULL,
                "current_balance" BIGINT DEFAULT 0 NOT NULL,
                "balance_in" BIGINT DEFAULT 0 NOT NULL,
                "balance_out" BIGINT DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                PRIMARY KEY ("wallet_id", "date"),
                CONSTRAINT "FK_wallet_id" FOREIGN KEY ("wallet_id") REFERENCES "transaction"."eb_wallet"("wallet_id") ON DELETE CASCADE

            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"."eb_wallet_daily_recap"`);
    }

}
