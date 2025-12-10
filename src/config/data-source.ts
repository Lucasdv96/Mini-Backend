import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";
import { Membership } from "../entities/membership.entity"; 
import { HistorialEstado } from "../entities/historial-estado.entity";
import { Etiqueta } from "../entities/etiqueta.entity";
import { Comment } from "../entities/comment.entity";
import { TaskTemplate } from "../entities/task-template.entity";  // NUEVO

export const AppdataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: false,
    logging: true,
    entities: [
        Task,
        User,
        Team,
        Membership,
        HistorialEstado,
        Etiqueta,
        Comment,
        TaskTemplate  // NUEVO
    ],
    migrations: ["src/migrations/*.ts"],
});

