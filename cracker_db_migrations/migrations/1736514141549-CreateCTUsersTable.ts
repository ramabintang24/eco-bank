import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCTUsersTable1736514141549 implements MigrationInterface {
  name = 'CreateCTUsersTable1736514141549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Membuat tabel ct_users di schema public
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "auth"."ct_users" (
        "user_id" UUID PRIMARY KEY,
        "role_id" UUID,
        "name" VARCHAR(100) NOT NULL,
        "password" TEXT NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "FK_role_id" FOREIGN KEY ("role_id") REFERENCES "auth"."ct_role"("role_id") ON DELETE CASCADE
      )
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "auth"."ct_users"`);
  }

}
