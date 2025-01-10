import { MigrationInterface, QueryRunner } from "typeorm";

export class Logging1736488409134 implements MigrationInterface {
  name = 'Logging1736488409134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Membuat tabel success_log di schema public
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "public"."success_log" (
        "id" SERIAL PRIMARY KEY, 
        "path" VARCHAR NOT NULL, 
        "app" VARCHAR NOT NULL, 
        "method" VARCHAR NOT NULL, 
        "ip" VARCHAR NOT NULL, 
        "query" JSON, 
        "headers" JSON, 
        "id_user" INTEGER, 
        "responseTime" INTEGER NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "body" TEXT
      )
    `);

    // Membuat tabel error_log di schema public
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "public"."error_log" (
        "id" SERIAL PRIMARY KEY, 
        "path" VARCHAR NOT NULL, 
        "app" VARCHAR NOT NULL, 
        "method" VARCHAR NOT NULL, 
        "ip" VARCHAR NOT NULL, 
        "query" JSON, 
        "headers" JSON, 
        "id_user" INTEGER, 
        "responseTime" INTEGER NOT NULL, 
        "errorMessage" VARCHAR NOT NULL, 
        "errorStack" VARCHAR NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "body" TEXT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Menghapus tabel error_log di schema public jika ada
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."error_log"`);

    // Menghapus tabel success_log di schema public jika ada
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."success_log"`);
  }
}
