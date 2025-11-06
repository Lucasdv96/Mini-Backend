import { Membership, RolMembresia } from "../entities/membership.entity";
import { TeamRepository } from "../repositories/team.repository";
import { UserRepository } from "../repositories/user.repository";
import { MembershipRepository } from "../repositories/membership.repository";

export class MembershipService {
  private membershipRepo = new MembershipRepository();
  private teamRepo = new TeamRepository();
  private userRepo = new UserRepository();

  async crearMembresiaPropietario(teamId: number, userId: number) {
    const team = await this.teamRepo.findById(teamId);
    const user = await this.userRepo.findById(userId);

    if (!team || !user) {
      throw new Error("Equipo o usuario no encontrado");
    }

    const membership = await this.membershipRepo.create({
      user,
      team,
      rol: RolMembresia.PROPIETARIO
    });

    return membership;
  }

  async agregarMiembro(teamId: number, userId: number, rol: RolMembresia, actorUserId: number) {
    // Verificar que el actor es propietario del equipo
    const actorMembership = await this.membershipRepo.findOne({
      where: { 
        user: { id: actorUserId }, 
        team: { id: teamId },
        rol: RolMembresia.PROPIETARIO
      }
    });

    if (!actorMembership) {
      throw new Error("Solo los propietarios pueden agregar miembros");
    }

    const team = await this.teamRepo.findById(teamId);
    const user = await this.userRepo.findById(userId);

    if (!team || !user) {
      throw new Error("Equipo o usuario no encontrado");
    }

    // Verificar si ya es miembro
    const existingMembership = await this.membershipRepo.findOne({
      where: { user: { id: userId }, team: { id: teamId } }
    });

    if (existingMembership) {
      throw new Error("El usuario ya es miembro de este equipo");
    }

    const membership = await this.membershipRepo.create({
      user,
      team,
      rol
    });

    return membership;
  }

  async removerMiembro(teamId: number, userId: number, actorUserId: number) {
    const actorMembership = await this.membershipRepo.findOne({
      where: { 
        user: { id: actorUserId }, 
        team: { id: teamId },
        rol: RolMembresia.PROPIETARIO
      }
    });

    if (!actorMembership) {
      throw new Error("Solo los propietarios pueden remover miembros");
    }

    // Verificar que no es el último propietario
    const propietarios = await this.membershipRepo.find({
      where: { 
        team: { id: teamId },
        rol: RolMembresia.PROPIETARIO
      }
    });

    if (propietarios.length === 1 && propietarios[0]?.user?.id === userId) {
      throw new Error("No se puede remover al último propietario del equipo");
    }

    const membership = await this.membershipRepo.findOne({
      where: { user: { id: userId }, team: { id: teamId } }
    });

    if (!membership) {
      throw new Error("El usuario no es miembro de este equipo");
    }

    await this.membershipRepo.remove(membership);
  }

  async listarMiembros(teamId: number) {
    return await this.membershipRepo.find({
      where: { team: { id: teamId } },
      relations: ["user"]
    });
  }

  async cambiarRol(teamId: number, userId: number, nuevoRol: RolMembresia, actorUserId: number) {
    const actorMembership = await this.membershipRepo.findOne({
      where: { 
        user: { id: actorUserId }, 
        team: { id: teamId },
        rol: RolMembresia.PROPIETARIO
      }
    });

    if (!actorMembership) {
      throw new Error("Solo los propietarios pueden cambiar roles");
    }

    const membership = await this.membershipRepo.findOne({
      where: { user: { id: userId }, team: { id: teamId } }
    });

    if (!membership) {
      throw new Error("El usuario no es miembro de este equipo");
    }

    membership.rol = nuevoRol;
    return await this.membershipRepo.save(membership);
  }

  async obtenerMembresia(teamId: number, userId: number) {
    return await this.membershipRepo.findOne({
      where: { 
        user: { id: userId }, 
        team: { id: teamId } 
      }
    });
  }

  async obtenerMembresiasPorUsuario(userId: number) {
  return await this.membershipRepo.find({
    where: { user: { id: userId } },
    relations: ["team"]
  });
  }
}