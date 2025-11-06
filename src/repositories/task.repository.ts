import { AppdataSource } from "../config/data-source";
import { Task, EstadoTarea } from "../entities/task.entity"; // Agregar EstadoTarea al import
import { Team } from "../entities/team.entity";
import { User } from "../entities/user.entity";
import { In } from "typeorm";

export class TaskRepository {
  private repo = AppdataSource.getRepository(Task);

  async create(title: string, description: string, teamId: number, userId: number) {
    const teamRepo = AppdataSource.getRepository(Team);
    const userRepo = AppdataSource.getRepository(User);
    
    const team = await teamRepo.findOneBy({ id: teamId });
    const user = await userRepo.findOneBy({ id: userId });
    
    if (!team) throw new Error("El equipo no existe");
    if (!user) throw new Error("El usuario no existe");

    const task = this.repo.create({ 
      title, 
      description, 
      estado: EstadoTarea.PENDIENTE, // Estado inicial
      team,
      user 
    });
    return await this.repo.save(task);
  }

  async getAll() {
  return await this.repo.find({ 
    relations: ["team", "user", "etiquetas"] 
  });
  }

  async getTasksByTeamId(teamId: number) {
  return await this.repo.find({ 
    where: { team: { id: teamId } }, 
    relations: ["team", "user", "etiquetas"]  
  });
  }

  async getTasksByTeamIds(teamIds: number[]) {
  return await this.repo.find({ 
    where: { team: { id: In(teamIds) } }, 
    relations: ["team", "user", "etiquetas"]  
  });
  }


  async findOneById(id: number) {
  return await this.repo.findOne({ 
    where: { id }, 
    relations: ["team", "user", "etiquetas"] 
  });
}

  async deleteTask(id: number) {
    await this.repo.delete(id);
  }

  async updateTask(id: number, data: Partial<Task>) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new Error("La tarea no existe");

    Object.assign(task, data);
    return await this.repo.save(task);
  }

  async getTasksByEstado(estado: EstadoTarea) {
  return await this.repo.find({ 
    where: { estado }, 
    relations: ["team", "user", "etiquetas"]  
  });
  }

  async getTasksByTeamIdsAndEstado(teamIds: number[], estado: EstadoTarea) {
  return await this.repo.find({ 
    where: { 
      team: { id: In(teamIds) },
      estado: estado
    }, 
    relations: ["team", "user", "etiquetas"]  
  });
  }
}