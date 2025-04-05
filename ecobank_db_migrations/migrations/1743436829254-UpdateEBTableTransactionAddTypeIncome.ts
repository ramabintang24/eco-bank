import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBTableTransactionAddTypeIncome1743436829254 implements MigrationInterface {
    name = 'UpdateEBTableTransactionAddTypeIncome1743436829254';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "transaction"."transaction_type_enum" ADD VALUE 'Income';

            -- Add column for officer name
            ALTER TABLE transaction.eb_detail_transaction ADD COLUMN officer_name VARCHAR(255);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Hapus kolom officer_name
            ALTER TABLE transaction.eb_bank_finance DROP COLUMN officer_name;
        `);
    }

}
