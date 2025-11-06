import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./task.entity";
import { Membership } from "./membership.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  rol!: "admin" | "user";

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships!: Membership[];

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}