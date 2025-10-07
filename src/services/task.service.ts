import { Task } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";
import { UserService } from "./user.service";

export class TaskService {
  private taskRepo = new TaskRepository();
  private userService = new UserService();

  async createTask(title: string, description: string, teamId: number, userId: number): Promise<Task> {
    if (!title || !title.trim()) throw new Error("El titulo no puede estar vacío");

    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");
    if (user.rol !== "admin") throw new Error("Solo los admins pueden crear tareas");
    

    return await this.taskRepo.create(title, description, teamId);
  }
  //ACOMODE EL GETALLTASKS PARA QUE SOLO ADMINS PUEDAN VER TODAS LAS TAREAS
  async getAllTasks(userId:number): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if(user?.rol !== "admin") throw new Error("Solo los admins pueden ver todas las tareas");
    return await this.taskRepo.getAll(userId);
  }

  //NUEVO VER TAREA DE USUARIO EN EL EQUIPO QUE PARTICIPA
  /*
  async getTasksByUser(userId: number): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");
    if (!user.team) throw new Error("El usuario no pertenece a ningún equipo");
    return await this.taskRepo.getTasksByTeamId(user.team.id);
  }*/
  


  async markTaskComplete(taskId: number, actorUserId: number): Promise<Task | null> {
    const task = await this.taskRepo.findOneById(taskId);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");

    if (task.team?.id !== actor.team?.id) {
      throw new Error("Solo miembros del mismo equipo pueden completar la tarea");
    }

    if (task.completed) throw new Error("La tarea ya está completada");

    return await this.taskRepo.markCompleted(taskId);
  }

  async deleteTask(taskId: number, actorUserId: number): Promise<void> {
    const task = await this.taskRepo.findOneById(taskId);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");
    if (actor.rol !== "admin") throw new Error("Solo admins pueden borrar tareas");

    if (task.team?.id !== actor.team?.id) {
      throw new Error("Solo admins del mismo equipo pueden borrar esta tarea");
    }

    await this.taskRepo.deleteTask(taskId);
  }

async updateTask(id: number, actorUserId: number, data: { title?: string; description?: string; priority?: string }) {
  const task = await this.taskRepo.findOneById(id);
  if (!task) throw new Error("La tarea no existe");

  const actor = await this.userService.findUserById(actorUserId);
  if (!actor) throw new Error("El usuario no existe");
  
  if (actor.rol !== "admin") throw new Error("Solo los admins pueden modificar tareas");
  if (task.team?.id !== actor.team?.id) {
    throw new Error("Solo admins del mismo equipo pueden modificar esta tarea");
  }

  return await this.taskRepo.updateTask(id, data);
}


}
