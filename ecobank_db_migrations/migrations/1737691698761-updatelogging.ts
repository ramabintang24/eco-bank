import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatelogging1737691698761 implements MigrationInterface {
    name = 'Updatelogging1737691698761';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
          ALTER TABLE "public"."success_log"
          ALTER COLUMN "id_user" DROP DEFAULT;
        `);
        await queryRunner.query(`
          ALTER TABLE "public"."success_log"
          ALTER COLUMN "id_user" TYPE UUID USING uuid_generate_v4();
        `);
    
        await queryRunner.query(`
          ALTER TABLE "public"."error_log"
          ALTER COLUMN "id_user" DROP DEFAULT;
        `);
        await queryRunner.query(`
          ALTER TABLE "public"."error_log"
          ALTER COLUMN "id_user" TYPE UUID USING uuid_generate_v4();
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
          ALTER TABLE "public"."success_log"
          ALTER COLUMN "id_user" TYPE INTEGER USING NULL;
        `);
    
        await queryRunner.query(`
          ALTER TABLE "public"."error_log"
          ALTER COLUMN "id_user" TYPE INTEGER USING NULL;
        `);
      }

}
