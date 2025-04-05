import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTriggerFinanceBankIncome1743782820112 implements MigrationInterface {
  name = 'CreateTriggerFinanceBankIncome1743782820112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION transaction.calculate_finance_after_detail()
      RETURNS TRIGGER AS $$
      DECLARE
        total_cost BIGINT := 0;
        v_total_amount BIGINT := 0;
        v_type VARCHAR;
        existing_finance UUID;
      BEGIN
        -- Cek apakah finance untuk transaksi ini sudah ada
        SELECT finance_id INTO existing_finance
        FROM transaction.eb_bank_finance
        WHERE transaction_id = NEW.transaction_id;

        -- Kalau sudah ada, jangan insert lagi
        IF existing_finance IS NOT NULL THEN
          RETURN NEW;
        END IF;

        -- Ambil tipe dan total_amount dari transaksi (pakai alias!)
        SELECT t.type, t.total_amount
        INTO v_type, v_total_amount
        FROM transaction.eb_transaction t
        WHERE t.transaction_id = NEW.transaction_id;

        -- Kalau tipenya Income, baru masukin ke finance
        IF v_type = 'Income' THEN
          -- Hitung total modal
          SELECT COALESCE(SUM(d.unit * d.purchase_price), 0)
          INTO total_cost
          FROM transaction.eb_detail_transaction d
          WHERE d.transaction_id = NEW.transaction_id;

          -- Insert ke eb_bank_finance
          INSERT INTO transaction.eb_bank_finance (
            transaction_id,
            amount,
            type,
            profit,
            created_at
          ) VALUES (
            NEW.transaction_id,
            v_total_amount,
            v_type::transaction.finance_type_enum,
            v_total_amount - total_cost,
            NOW()
          );
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_finance_after_detail_insert ON transaction.eb_detail_transaction;

      CREATE TRIGGER trigger_finance_after_detail_insert
      AFTER INSERT ON transaction.eb_detail_transaction
      FOR EACH ROW
      EXECUTE FUNCTION transaction.calculate_finance_after_detail();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_finance_after_detail_insert ON transaction.eb_detail_transaction;
      DROP FUNCTION IF EXISTS transaction.calculate_finance_after_detail;
    `);
  }
}
