import { Task, EstadoTarea } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";
import { UserService } from "./user.service";
import { MembershipService } from "./membership.service";
import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";

export class TaskService {
  private taskRepo = new TaskRepository();
  private userService = new UserService();
  private membershipService = new MembershipService();
  private teamRepo = AppdataSource.getRepository(Team);

  async createTask(title: string, description: string, teamId: number, userId: number): Promise<Task> {
    if (!title || !title.trim()) throw new Error("El titulo no puede estar vacío");

    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");
    
    // Verificar que el usuario es admin del equipo específico
    const membresia = await this.membershipService.obtenerMembresia(teamId, userId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo los propietarios del equipo pueden crear tareas");
    }

    const team = await this.teamRepo.findOneBy({ id: teamId });
    if (!team) throw new Error("El equipo no existe");

    return await this.taskRepo.create(title, description, teamId, userId);
  }

  async getAllTasks(userId: number): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");

    // Si es ADMIN, ver todas las tareas
    if (user.rol === "admin") {
      return await this.taskRepo.getAll();
    }

    // Para usuarios normales, obtener los equipos a los que pertenece
    const membresias = await this.membershipService.obtenerMembresiasPorUsuario(userId);
    if (membresias.length === 0) {
      throw new Error("El usuario no pertenece a ningún equipo");
    }

    // Obtener IDs de todos los equipos del usuario
    const teamIds = membresias.map(m => m.team.id);
    
    // Obtener tareas de todos sus equipos
    return await this.taskRepo.getTasksByTeamIds(teamIds);
  }

  async getTasksByEstado(userId: number, estado: EstadoTarea): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");

    if (user.rol === "admin") {
      return await this.taskRepo.getTasksByEstado(estado);
    }

    // Para usuarios normales, filtrar por sus equipos
    const membresias = await this.membershipService.obtenerMembresiasPorUsuario(userId);
    if (membresias.length === 0) {
      throw new Error("El usuario no pertenece a ningún equipo");
    }

    const teamIds = membresias.map(m => m.team.id);
    return await this.taskRepo.getTasksByTeamIdsAndEstado(teamIds, estado);
  }

  async deleteTask(taskId: number, actorUserId: number): Promise<void> {
    const task = await this.taskRepo.findOneById(taskId);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");

    // Verificar que el actor es propietario del equipo de la tarea
    const membresia = await this.membershipService.obtenerMembresia(task.team.id, actorUserId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo propietarios del equipo pueden borrar tareas");
    }

    await this.taskRepo.deleteTask(taskId);
  }

  async updateTask(id: number, actorUserId: number, data: { title?: string; description?: string; priority?: string }) {
    const task = await this.taskRepo.findOneById(id);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");
    
    // Verificar que el actor es propietario del equipo de la tarea
    const membresia = await this.membershipService.obtenerMembresia(task.team.id, actorUserId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo propietarios del equipo pueden modificar tareas");
    }

    // No permitir edición si la tarea está finalizada o cancelada
    if (task.estado === EstadoTarea.FINALIZADA || task.estado === EstadoTarea.CANCELADA) {
      throw new Error("No se puede modificar una tarea finalizada o cancelada");
    }

    return await this.taskRepo.updateTask(id, data);
  }
}