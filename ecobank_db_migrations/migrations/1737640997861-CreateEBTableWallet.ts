import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableWallet1737640997861 implements MigrationInterface {
    name = 'CreateEBTableWallet1737640997861';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "transaction"`);

        await queryRunner.query(`
            CREATE TABLE "transaction"."eb_wallet" (
                "wallet_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "user_id" UUID NOT NULL,
                "balance" bigint DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."eb_user"("user_id") ON DELETE CASCADE

            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"."eb_wallet"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "transaction"`);
    }

}
