import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1759443301050 implements MigrationInterface {
    name = 'InitMigration1759443301050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "completed" boolean NOT NULL DEFAULT (0), "priority" text NOT NULL DEFAULT ('media'), CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "userId", "teamId", "completed") SELECT "id", "title", "description", "userId", "teamId", "completed" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "completed" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "userId", "teamId", "completed") SELECT "id", "title", "description", "userId", "teamId", "completed" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
    }

}
