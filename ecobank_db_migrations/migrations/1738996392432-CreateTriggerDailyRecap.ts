import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTriggerDailyRecap1738996392432 implements MigrationInterface {
    name = 'CreateTriggerDailyRecap1738996392432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Create or replace the function
            CREATE OR REPLACE FUNCTION update_daily_recap()
            RETURNS TRIGGER AS $$
            DECLARE
                balance_diff bigint;
                current_date date := CURRENT_DATE;
                is_exist boolean;
            BEGIN
                balance_diff = NEW.balance - OLD.balance;

                SELECT EXISTS (
                    SELECT 1
                    FROM transaction.eb_wallet_daily_recap
                    WHERE wallet_id = NEW.wallet_id
                    AND date = current_date
                ) INTO is_exist;

                IF is_exist THEN
                    IF balance_diff > 0 THEN
                        UPDATE transaction.eb_wallet_daily_recap
                        SET balance_in = balance_in + balance_diff,
                            current_balance = NEW.balance,
                            updated_at = NOW()
                        WHERE wallet_id = NEW.wallet_id
                        AND date = current_date;

                    ELSIF balance_diff < 0 THEN
                        UPDATE transaction.eb_wallet_daily_recap
                        SET balance_out = balance_out + ABS(balance_diff),
                            current_balance = NEW.balance,
                            updated_at = NOW()
                        WHERE wallet_id = NEW.wallet_id
                        AND date = current_date;
                    END IF;

                ELSE
                    IF balance_diff > 0 THEN
                        INSERT INTO transaction.eb_wallet_daily_recap (
                            wallet_id, date, balance_in, balance_out, current_balance, created_at, updated_at
                        )
                        VALUES (
                            NEW.wallet_id, current_date, balance_diff, 0, NEW.balance, NOW(), NOW()
                        );

                    ELSIF balance_diff < 0 THEN
                        INSERT INTO transaction.eb_wallet_daily_recap (
                            wallet_id, date, balance_in, balance_out, current_balance, created_at, updated_at
                        )
                        VALUES (
                            NEW.wallet_id, current_date, 0, ABS(balance_diff), NEW.balance, NOW(), NOW()
                        );
                    END IF;
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Create the trigger
            CREATE TRIGGER update_wallet_daily_recap
            AFTER UPDATE OF balance ON transaction.eb_wallet
            FOR EACH ROW
            EXECUTE FUNCTION update_daily_recap();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Drop the trigger
            DROP TRIGGER IF EXISTS update_wallet_daily_recap ON transaction.eb_wallet;

            -- Drop the function
            DROP FUNCTION IF EXISTS update_daily_recap;
        `);
    }

}
