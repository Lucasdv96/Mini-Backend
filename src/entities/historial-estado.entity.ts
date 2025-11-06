import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";
import { EstadoTarea } from "./task.entity";

@Entity()
export class HistorialEstado {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Task, (task) => task.historialEstados, { nullable: false })
  tarea!: Task;

  @Column({
    type: "text",
    enum: EstadoTarea
  })
  estadoAnterior!: EstadoTarea;

  @Column({
    type: "text", 
    enum: EstadoTarea
  })
  estadoNuevo!: EstadoTarea;

  @ManyToOne(() => User, { nullable: false })
  usuario!: User;

  @CreateDateColumn()
  fecha!: Date;
}