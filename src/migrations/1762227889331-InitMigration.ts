import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1762227889331 implements MigrationInterface {
    name = 'InitMigration1762227889331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "membership"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "temporary_membership" RENAME TO "membership"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "priority" text NOT NULL DEFAULT ('media'), "estado" varchar CHECK( "estado" IN ('PENDIENTE','EN_CURSO','FINALIZADA','CANCELADA') ) NOT NULL DEFAULT ('PENDIENTE'), "dueDate" datetime, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "historialEstadosId" integer, CONSTRAINT "FK_81dff849ce37d44c8821afdb197" FOREIGN KEY ("historialEstadosId") REFERENCES "historial_estado" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId") SELECT "id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "etiqueta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar NOT NULL, "color" varchar NOT NULL, CONSTRAINT "UQ_c24e444690deb02aa6202719e56" UNIQUE ("nombre"))`);
        await queryRunner.query(`CREATE TABLE "tarea_etiquetas" ("tarea_id" integer NOT NULL, "etiqueta_id" integer NOT NULL, PRIMARY KEY ("tarea_id", "etiqueta_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_96c0fa009acbf5f725ac14562b" ON "tarea_etiquetas" ("tarea_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbf5a012f11b065a74d9769bad" ON "tarea_etiquetas" ("etiqueta_id") `);
        await queryRunner.query(`CREATE TABLE "temporary_membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "membership"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`ALTER TABLE "temporary_membership" RENAME TO "membership"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "priority" text NOT NULL DEFAULT ('media'), "estado" varchar CHECK( "estado" IN ('PENDIENTE','EN_CURSO','FINALIZADA','CANCELADA') ) NOT NULL DEFAULT ('PENDIENTE'), "dueDate" datetime, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "historialEstadosId" integer, CONSTRAINT "FK_81dff849ce37d44c8821afdb197" FOREIGN KEY ("historialEstadosId") REFERENCES "historial_estado" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId") SELECT "id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`DROP INDEX "IDX_96c0fa009acbf5f725ac14562b"`);
        await queryRunner.query(`DROP INDEX "IDX_fbf5a012f11b065a74d9769bad"`);
        await queryRunner.query(`CREATE TABLE "temporary_tarea_etiquetas" ("tarea_id" integer NOT NULL, "etiqueta_id" integer NOT NULL, CONSTRAINT "FK_96c0fa009acbf5f725ac14562bd" FOREIGN KEY ("tarea_id") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_fbf5a012f11b065a74d9769bad7" FOREIGN KEY ("etiqueta_id") REFERENCES "etiqueta" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("tarea_id", "etiqueta_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_tarea_etiquetas"("tarea_id", "etiqueta_id") SELECT "tarea_id", "etiqueta_id" FROM "tarea_etiquetas"`);
        await queryRunner.query(`DROP TABLE "tarea_etiquetas"`);
        await queryRunner.query(`ALTER TABLE "temporary_tarea_etiquetas" RENAME TO "tarea_etiquetas"`);
        await queryRunner.query(`CREATE INDEX "IDX_96c0fa009acbf5f725ac14562b" ON "tarea_etiquetas" ("tarea_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbf5a012f11b065a74d9769bad" ON "tarea_etiquetas" ("etiqueta_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_fbf5a012f11b065a74d9769bad"`);
        await queryRunner.query(`DROP INDEX "IDX_96c0fa009acbf5f725ac14562b"`);
        await queryRunner.query(`ALTER TABLE "tarea_etiquetas" RENAME TO "temporary_tarea_etiquetas"`);
        await queryRunner.query(`CREATE TABLE "tarea_etiquetas" ("tarea_id" integer NOT NULL, "etiqueta_id" integer NOT NULL, PRIMARY KEY ("tarea_id", "etiqueta_id"))`);
        await queryRunner.query(`INSERT INTO "tarea_etiquetas"("tarea_id", "etiqueta_id") SELECT "tarea_id", "etiqueta_id" FROM "temporary_tarea_etiquetas"`);
        await queryRunner.query(`DROP TABLE "temporary_tarea_etiquetas"`);
        await queryRunner.query(`CREATE INDEX "IDX_fbf5a012f11b065a74d9769bad" ON "tarea_etiquetas" ("etiqueta_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96c0fa009acbf5f725ac14562b" ON "tarea_etiquetas" ("tarea_id") `);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "priority" text NOT NULL DEFAULT ('media'), "estado" varchar CHECK( "estado" IN ('PENDIENTE','EN_CURSO','FINALIZADA','CANCELADA') ) NOT NULL DEFAULT ('PENDIENTE'), "dueDate" datetime, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "historialEstadosId" integer, CONSTRAINT "FK_81dff849ce37d44c8821afdb197" FOREIGN KEY ("historialEstadosId") REFERENCES "historial_estado" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId") SELECT "id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "membership" RENAME TO "temporary_membership"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "temporary_membership"`);
        await queryRunner.query(`DROP TABLE "temporary_membership"`);
        await queryRunner.query(`DROP INDEX "IDX_fbf5a012f11b065a74d9769bad"`);
        await queryRunner.query(`DROP INDEX "IDX_96c0fa009acbf5f725ac14562b"`);
        await queryRunner.query(`DROP TABLE "tarea_etiquetas"`);
        await queryRunner.query(`DROP TABLE "etiqueta"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, "priority" text NOT NULL DEFAULT ('media'), "estado" varchar CHECK( "estado" IN ('PENDIENTE','EN_CURSO','FINALIZADA','CANCELADA') ) NOT NULL DEFAULT ('PENDIENTE'), "dueDate" datetime, "fechaCreacion" datetime NOT NULL DEFAULT (datetime('now')), "historialEstadosId" integer, CONSTRAINT "FK_81dff849ce37d44c8821afdb197" FOREIGN KEY ("historialEstadosId") REFERENCES "historial_estado" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId") SELECT "id", "title", "description", "userId", "teamId", "priority", "estado", "dueDate", "fechaCreacion", "historialEstadosId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "membership" RENAME TO "temporary_membership"`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rol" varchar CHECK( "rol" IN ('PROPIETARIO','MIEMBRO') ) NOT NULL DEFAULT ('MIEMBRO'), "fechaIngreso" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8cbaee95bef7db57d99430b302b" UNIQUE ("userId", "teamId"), CONSTRAINT "FK_f587b1be7b7595b5af79a2fd008" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "membership"("id", "rol", "fechaIngreso", "userId", "teamId") SELECT "id", "rol", "fechaIngreso", "userId", "teamId" FROM "temporary_membership"`);
        await queryRunner.query(`DROP TABLE "temporary_membership"`);
    }

}
