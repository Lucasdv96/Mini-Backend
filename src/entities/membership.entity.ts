import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";

export enum RolMembresia {
  PROPIETARIO = "PROPIETARIO",
  MIEMBRO = "MIEMBRO"
}

@Entity()
@Unique(["user", "team"]) // Un usuario solo puede estar una vez en un equipo
export class Membership {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.memberships, { nullable: false })
  user!: User;

  @ManyToOne(() => Team, (team) => team.memberships, { nullable: false })
  team!: Team;

  @Column({
    type: "text",
    enum: RolMembresia,
    default: RolMembresia.MIEMBRO
  })
  rol!: RolMembresia;

  @CreateDateColumn()
  fechaIngreso!: Date;
}