import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  contenido!: string;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false, eager: true })
  usuario!: User;

  @ManyToOne(() => Task, (task) => task.comments, { nullable: false, onDelete: "CASCADE" })
  tarea!: Task;

  @CreateDateColumn()
  fechaCreacion!: Date;
}