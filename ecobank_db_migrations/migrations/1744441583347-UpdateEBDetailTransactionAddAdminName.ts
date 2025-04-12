import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBDetailTransactionAddAdminName1744441583347 implements MigrationInterface {
    name = 'UpdateEBDetailTransactionAddAdminName1744441583347';


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            ADD COLUMN "admin_name" VARCHAR(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_detail_transaction"
            DROP COLUMN "admin_name"
        `);
    }

}