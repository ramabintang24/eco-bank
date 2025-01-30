import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEBTableUser1737637019867 implements MigrationInterface {

    name = 'CreateEBTableUser1737637019867';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);

      await queryRunner.query(`
        CREATE TYPE "auth"."role_enum" AS ENUM ('Admin', 'User')
      `);
        
      await queryRunner.query(`
        CREATE TYPE "auth"."gender_enum" AS ENUM ('Laki-Laki', 'Perempuan')
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "auth"."eb_user" (
          "user_id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          "name" VARCHAR(100) NOT NULL,
          "email" VARCHAR(100) UNIQUE NOT NULL,
          "password" TEXT NOT NULL,
          "role" "auth"."role_enum" NOT NULL,
          "profile_url" TEXT NOT NULL,
          "birth_date" DATE NULL,
          "gender" "auth"."gender_enum" NULL,
          "phone_number" VARCHAR(15) NULL,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "last_login_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "last_active_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "deleted_at" TIMESTAMP
        )
      `);
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE IF EXISTS "auth"."eb_user"');
      
      await queryRunner.query('DROP TYPE IF EXISTS "auth"."gender_enum"');
      
      await queryRunner.query('DROP TYPE IF EXISTS "auth"."role_enum"');

      await queryRunner.query(`DROP SCHEMA IF EXISTS "auth"`);
    }

}
