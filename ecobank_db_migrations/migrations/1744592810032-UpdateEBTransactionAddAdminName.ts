import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBTransactionAddAdminName1744592810032 implements MigrationInterface {
    name = 'UpdateEBTransactionAddAdminName1744592810032';


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_transaction"
            ADD COLUMN "admin_name" VARCHAR
        `);

        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            DROP COLUMN "admin_name"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            ADD COLUMN "admin_name" VARCHAR(255)
        `);
        
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_transaction"
            DROP COLUMN "admin_name"
        `);
    }

}
