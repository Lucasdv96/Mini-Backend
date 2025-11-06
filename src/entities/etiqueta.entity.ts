import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Etiqueta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column()
  color!: string; // formato: "#FF5733"

  @ManyToMany(() => Task, (task) => task.etiquetas)
  tareas!: Task[];
}