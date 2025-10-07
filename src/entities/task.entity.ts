import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: false })
  completed!: boolean;
  
  @Column({type: "text",default:"media"})
  priority!: string;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user!: User;

  @ManyToOne(() => Team, (team) => team.tasks, { eager: true })
  team!: Team;
}
