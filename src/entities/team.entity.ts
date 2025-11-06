import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";
import { Membership } from "./membership.entity";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "propietarioId" })  
  propietario!: User;

  @OneToMany(() => Membership, (membership) => membership.team)
  memberships!: Membership[];

  @OneToMany(() => Task, (task) => task.team)
  tasks!: Task[];
}