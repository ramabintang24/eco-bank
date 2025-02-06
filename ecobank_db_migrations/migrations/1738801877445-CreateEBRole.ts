import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleTable1738801877445 implements MigrationInterface {
    name = 'CreateRoleTable1738801877445';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);

        await queryRunner.query(`
            CREATE TABLE "auth"."eb_role" (
                "role_id" SERIAL PRIMARY KEY,
                "role_name" VARCHAR(50) NOT NULL UNIQUE,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "auth"."eb_role"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "auth"`);
    }
}
