import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTriggerSetBalanceAfterTransaction1739109799620 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Create or replace the update_wallet_balance function
            CREATE OR REPLACE FUNCTION update_wallet_balance()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Update balance di transaction.eb_wallet berdasarkan current_balance
                UPDATE transaction.eb_wallet
                SET balance = NEW.current_balance
                WHERE wallet_id = NEW.wallet_id;
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Create the after_insert trigger on transaction.eb_transaction
            CREATE TRIGGER after_insert_transaction
            AFTER INSERT ON transaction.eb_transaction
            FOR EACH ROW
            EXECUTE FUNCTION update_wallet_balance();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Drop the after_insert_transaction trigger
            DROP TRIGGER IF EXISTS after_insert_transaction ON transaction.eb_transaction;

            -- Drop the update_wallet_balance function
            DROP FUNCTION IF EXISTS update_wallet_balance;
        `);
    }

}
