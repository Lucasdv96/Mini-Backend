import { Team } from "../entities/team.entity";
import { TeamRepository } from "../repositories/team.repository";
import { UserRepository } from "../repositories/user.repository";

export class TeamService {
  private teamRepo = new TeamRepository();
  private userRepo = new UserRepository();

  async createTeam(name: string): Promise<Team> {
    if (!name || !name.trim()) throw new Error("El nombre del equipo no puede estar vacío");
    return await this.teamRepo.create(name);
  }

  async addUserToTeam(teamId: number, userId: number) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new Error("Equipo no encontrado");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    return await this.userRepo.assignTeam(userId, team);
  }

  async getTeamById(teamId: number) {
    return await this.teamRepo.findById(teamId);
  }

  async getAllTeams() {
    return await this.teamRepo.getAll();
  }

  //NUEVO: UPDATE
  async updateTeam(teamId: number, name: string, actorUserId: number): Promise<Team> {
    //valida que el nombre no esté vacío
    if (!name || !name.trim()){ 
      throw new Error("El nombre del equipo no puede estar vacío");
    }
      
    //verificar que el equipo existe
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new Error("Equipo no encontrado"); 

    //verificar que el usuario que hace la petición existe
    const actorUser = await this.userRepo.findById(actorUserId);
    if (!actorUser) throw new Error("Usuario que realiza la petición no encontrado");

    // verificar que el usuario que hace la petición es admin
    /*
    if (actorUser.rol !== "admin") {
      throw new Error("No tienes permisos para actualizar el equipo");
    }*/

    //verificar que el admin pertenece al equipo que quiere actualizar
    if(actorUser.team?.id !== team.id){
      throw new Error("No puedes actualizar un equipo al que no perteneces");
    }

    // actualizar el equipo
    const updateTeam = await this.teamRepo.update(teamId, name);
    if(!updateTeam){
      throw new Error("No se pudo actualizar el equipo");
    }
    return updateTeam;
  }

  //NUEVO: DELETE
  async deleteTeam(teamId: number, actorUserId: number): Promise<Team> {
    // eliminar el equipo
    const deletedTeam = await this.teamRepo.delete(teamId); 
    if(!deletedTeam){
      throw new Error("No se pudo eliminar el equipo");
    }
    return deletedTeam;
  } 
}
