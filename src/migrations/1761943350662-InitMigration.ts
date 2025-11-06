import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1761943350662 implements MigrationInterface {
    name = 'InitMigration1761943350662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "membership"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "temporary_membership" RENAME TO "membership"`);
        await queryRunner.query(`CREATE TABLE "temporary_membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "membership"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "temporary_membership" RENAME TO "membership"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" RENAME TO "temporary_membership"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "temporary_membership"`);
        await queryRunner.query(`DROP TABLE "temporary_membership"`);
        await queryRunner.query(`ALTER TABLE "membership" RENAME TO "temporary_membership"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "temporary_membership"`);
        await queryRunner.query(`DROP TABLE "temporary_membership"`);
    }

}
