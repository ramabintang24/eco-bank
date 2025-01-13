import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCTUsersTable1736745368908 implements MigrationInterface {
  name = 'UpdateCTUsersTable1736745368908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the pgcrypto extension is enabled to use gen_random_uuid()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Alter the role_id column to set the default value to gen_random_uuid()
    await queryRunner.query(`
      ALTER TABLE "auth"."ct_users"
      ALTER COLUMN "user_id"
      SET DEFAULT gen_random_uuid()
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the default value from the role_id column
    await queryRunner.query(`
      ALTER TABLE "auth"."ct_users"
      ALTER COLUMN "users_id"
      DROP DEFAULT
    `);
  }

}
