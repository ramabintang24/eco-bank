import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatelogging1736780605555 implements MigrationInterface {
  name = 'Updatelogging1736780605555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter success_log table
    await queryRunner.query(`
      ALTER TABLE "public"."success_log"
      ALTER COLUMN "id_user" DROP NOT NULL,
      ALTER COLUMN "id_user" TYPE UUID USING (NULL),
      ADD CONSTRAINT "FK_success_log_user" FOREIGN KEY ("id_user") REFERENCES "auth"."ct_users"("user_id") ON DELETE SET NULL
    `);

    // Alter error_log table
    await queryRunner.query(`
      ALTER TABLE "public"."error_log"
      ALTER COLUMN "id_user" DROP NOT NULL,
      ALTER COLUMN "id_user" TYPE UUID USING (NULL),
      ADD CONSTRAINT "FK_error_log_user" FOREIGN KEY ("id_user") REFERENCES "auth"."ct_users"("user_id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes for success_log table
    await queryRunner.query(`
      ALTER TABLE "public"."success_log"
      DROP CONSTRAINT "FK_success_log_user",
      ALTER COLUMN "id_user" TYPE INTEGER USING (NULL),
      ALTER COLUMN "id_user" DROP NOT NULL
    `);

    // Revert changes for error_log table
    await queryRunner.query(`
      ALTER TABLE "public"."error_log"
      DROP CONSTRAINT "FK_error_log_user",
      ALTER COLUMN "id_user" TYPE INTEGER USING (NULL),
      ALTER COLUMN "id_user" DROP NOT NULL
    `);
  }

}
