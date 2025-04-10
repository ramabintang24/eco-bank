import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEBTableItem1744267663325 implements MigrationInterface {
    name = 'UpdateEBTableItem1744267663325';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_item"
            ADD COLUMN "image_url" TEXT NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"."eb_item"
            DROP COLUMN "image_url"
        `);
    }

}
