import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTriggerSetCurrentBalanceBeforeTransaction1739107993613 implements MigrationInterface {
    name = 'CreateTriggerDailyRecap1738996392432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Create or replace the set_current_balance function
            CREATE OR REPLACE FUNCTION set_current_balance()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Ambil current balance dari transaction.eb_wallet berdasarkan wallet_id
                SELECT balance INTO NEW.current_balance
                FROM transaction.eb_wallet
                WHERE wallet_id = NEW.wallet_id;

                -- Periksa nilai type untuk menentukan operasi pada current_balance
                IF NEW.type = 'Deposit' THEN
                    NEW.current_balance := NEW.current_balance + NEW.total_amount;
                ELSIF NEW.type = 'Withdraw' THEN
                    NEW.current_balance := NEW.current_balance - NEW.total_amount;

                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Create the before_insert trigger on transaction.eb_transaction
            CREATE TRIGGER before_insert_transaction
            BEFORE INSERT ON transaction.eb_transaction
            FOR EACH ROW
            EXECUTE FUNCTION set_current_balance();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS before_insert_transaction ON transaction.eb_transaction;
            DROP FUNCTION IF EXISTS set_current_balance;
        `);
    }

}
