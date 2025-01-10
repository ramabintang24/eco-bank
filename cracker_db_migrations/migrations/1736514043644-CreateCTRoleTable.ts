import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCTRoleTable1736514043644 implements MigrationInterface {
  name = 'CreateCTRoleTable1736514043644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Membuat tabel ct_role di schema auth
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "auth"."ct_role" (
        "role_id" UUID PRIMARY KEY,
        "role" VARCHAR NOT NULL CHECK ("role" IN ('admin', 'cashier', 'warehouse')),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        "deleted_at" TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Menghapus tabel ct_role di schema public jika ada
    await queryRunner.query(`DROP TABLE IF EXISTS "auth"."ct_role"`);
  }

}
