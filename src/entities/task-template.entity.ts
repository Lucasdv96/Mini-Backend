import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { Etiqueta } from "./etiqueta.entity";

export enum PriorityTemplate {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

@Entity()
@Unique(["name", "creator"]) // Nombre único por creador
export class TaskTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "text",
    enum: PriorityTemplate,
    default: PriorityTemplate.MEDIUM
  })
  priority!: PriorityTemplate;

  @ManyToOne(() => Team, { nullable: true })
  team?: Team;

  @ManyToOne(() => User, { nullable: false, eager: true })
  creator!: User;

  @ManyToMany(() => Etiqueta)
  @JoinTable({
    name: "template_etiquetas",
    joinColumn: {
      name: "template_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "etiqueta_id",
      referencedColumnName: "id",
    },
  })
  tags!: Etiqueta[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}