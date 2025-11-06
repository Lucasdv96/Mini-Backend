import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1761939506409 implements MigrationInterface {
    name = 'InitMigration1761939506409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "rol", "teamId") SELECT "id", "name", "rol", "teamId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "rol") SELECT "id", "name", "rol" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_team" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "propietarioId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_team"("id", "name") SELECT "id", "name" FROM "team"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`ALTER TABLE "temporary_team" RENAME TO "team"`);
        await queryRunner.query(`CREATE TABLE "temporary_team" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "propietarioId" integer NOT NULL, CONSTRAINT "FK_1ac489eb3a6017b8d3ae99470f4" FOREIGN KEY ("propietarioId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_team"("id", "name", "description", "fechaCreacion", "propietarioId") SELECT "id", "name", "description", "fechaCreacion", "propietarioId" FROM "team"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`ALTER TABLE "temporary_team" RENAME TO "team"`);
        await queryRunner.query(`CREATE TABLE "temporary_membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "membership"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "temporary_membership" RENAME TO "membership"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" RENAME TO "temporary_membership"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"))`);
        await queryRunner.query(`INSERT INTO "membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "temporary_membership"`);
        await queryRunner.query(`DROP TABLE "temporary_membership"`);
        await queryRunner.query(`ALTER TABLE "team" RENAME TO "temporary_team"`);
        await queryRunner.query(`CREATE TABLE "team" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "propietarioId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "team"("id", "name", "description", "fechaCreacion", "propietarioId") SELECT "id", "name", "description", "fechaCreacion", "propietarioId" FROM "temporary_team"`);
        await queryRunner.query(`DROP TABLE "temporary_team"`);
        await queryRunner.query(`ALTER TABLE "team" RENAME TO "temporary_team"`);
        await queryRunner.query(`CREATE TABLE "team" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "team"("id", "name") SELECT "id", "name" FROM "temporary_team"`);
        await queryRunner.query(`DROP TABLE "temporary_team"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "rol") SELECT "id", "name", "rol" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer, CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "rol", "teamId") SELECT "id", "name", "rol", "teamId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
