import { Team } from "../entities/team.entity";
import { TeamRepository } from "../repositories/team.repository";
import { UserRepository } from "../repositories/user.repository";
import { MembershipService } from "../services/membership.service";
import { RolMembresia } from "../entities/membership.entity";

export class TeamService {
  private teamRepo = new TeamRepository();
  private userRepo = new UserRepository();
  private membershipService = new MembershipService();

  async createTeam(name: string, propietarioId: number): Promise<Team> {
  if (!name || !name.trim()) throw new Error("El nombre del equipo no puede estar vacío");

  const propietario = await this.userRepo.findById(propietarioId);
  if (!propietario) throw new Error("El usuario propietario no existe");

  console.log(`Creando equipo: ${name} con propietario: ${propietarioId}`); // Debug

  const team = await this.teamRepo.create(name, propietario);
  console.log(`Equipo creado con ID: ${team.id}`); // Debug

  // Crear automáticamente la membresía del propietario
  try {
    await this.membershipService.crearMembresiaPropietario(team.id, propietarioId);
    console.log(`Membresía de propietario creada para usuario ${propietarioId} en equipo ${team.id}`); // Debug
  } catch (error) {
    console.error('Error creando membresía:', error);
    throw error;
  }

  return team;
}

  async addUserToTeam(teamId: number, userId: number, actorUserId: number) {
    return await this.membershipService.agregarMiembro(teamId, userId, RolMembresia.MIEMBRO, actorUserId);
  }

  async getTeamById(teamId: number) {
    return await this.teamRepo.findById(teamId);
  }

  async getAllTeams() {
    return await this.teamRepo.getAll();
  }

  async updateTeam(teamId: number, name: string, actorUserId: number): Promise<Team> {
    if (!name || !name.trim()){ 
      throw new Error("El nombre del equipo no puede estar vacío");
    }
      
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new Error("Equipo no encontrado");

  
    const userMembership = await this.membershipService.obtenerMembresia(teamId, actorUserId);
    if (!userMembership || userMembership.rol !== RolMembresia.PROPIETARIO) {
      throw new Error("No puedes actualizar un equipo si no eres propietario");
    }

    return await this.teamRepo.update(teamId, name);
  }

  async deleteTeam(teamId: number, actorUserId: number): Promise<void> {
    const userMembership = await this.membershipService.obtenerMembresia(teamId, actorUserId);
    if (!userMembership || userMembership.rol !== RolMembresia.PROPIETARIO) {
      throw new Error("No puedes eliminar un equipo si no eres propietario");
    }

    await this.teamRepo.delete(teamId);
  } 

  async getUsuariosDelEquipo(teamId: number) {
  const team = await this.teamRepo.findById(teamId);
  if (!team) throw new Error("Equipo no encontrado");
  
  // Obtener usuarios a través de las membresías
  const membresias = await this.membershipService.listarMiembros(teamId);
  return membresias.map(membresia => membresia.user);
}
}