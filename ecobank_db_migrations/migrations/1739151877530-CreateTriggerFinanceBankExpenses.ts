import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTriggerFinanceBankExpenses1739151877530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Create or replace the insert_into_eb_bank_finance function
            CREATE OR REPLACE FUNCTION insert_into_eb_bank_finance()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Periksa apakah tipe transaksi adalah 'Withdraw'
                IF NEW.type = 'Withdraw' THEN
                    -- Masukkan data baru ke tabel finance jika tipe adalah Withdraw
                    INSERT INTO transaction.eb_bank_finance (transaction_id, amount, type)
                    VALUES (NEW.transaction_id, NEW.total_amount, 'Expenses');
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Create the after_insert trigger on transaction.eb_transaction
            CREATE TRIGGER after_transaction_insert_into_eb_bank_finance
            AFTER INSERT ON transaction.eb_transaction
            FOR EACH ROW
            EXECUTE FUNCTION insert_into_eb_bank_finance();
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS after_transaction_insert_into_eb_bank_finance ON transaction.eb_transaction;

            DROP FUNCTION IF EXISTS insert_into_eb_bank_finance();
        `);
    }

}
