import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn , OneToMany , ManyToMany , JoinTable} from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { HistorialEstado } from "./historial-estado.entity";
import { Etiqueta } from "./etiqueta.entity";
import { Comment } from "./comment.entity";

export enum EstadoTarea {
  PENDIENTE = "PENDIENTE",
  EN_CURSO = "EN_CURSO", 
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA"
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: "text",
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE
  })
  estado!: EstadoTarea;

  @Column({
    type: "text",
    default: "media"
  })
  priority!: string;

  @Column({ type: "datetime", nullable: true })
  dueDate?: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user!: User;

  @ManyToOne(() => Team, (team) => team.tasks, { eager: true })
  team!: Team;

  @OneToMany(() => Comment, (comment) => comment.tarea)
  comments!: Comment[];

  @CreateDateColumn()
  fechaCreacion!: Date;

  @ManyToOne(() => HistorialEstado, (historial) => historial.tarea)
  historialEstados!: HistorialEstado[];

  @ManyToMany(() => Etiqueta, (etiqueta) => etiqueta.tareas)
  @JoinTable({
  name: "tarea_etiquetas",
  joinColumn: {
    name: "tarea_id",
    referencedColumnName: "id",
  },
  inverseJoinColumn: {
    name: "etiqueta_id",
    referencedColumnName: "id",
  },
})
etiquetas!: Etiqueta[];
}