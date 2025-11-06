import { AppdataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";
import { Etiqueta } from "../entities/etiqueta.entity";
import { TaskRepository } from "../repositories/task.repository";
import { EtiquetaService } from "./etiqueta.service";
import { MembershipService } from "./membership.service";
import { UserService } from "./user.service";

export class TareaEtiquetaService {
  private taskRepo = new TaskRepository();
  private etiquetaService = new EtiquetaService();
  private membershipService = new MembershipService();
  private userService = new UserService();
  private etiquetaRepo = AppdataSource.getRepository(Etiqueta);
  private taskRepository = AppdataSource.getRepository(Task);

  async asignarEtiquetasATarea(tareaId: number, etiquetasIds: number[], usuarioId: number): Promise<Task> {
    const tarea = await this.taskRepo.findOneById(tareaId);
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar permisos del usuario
    const usuario = await this.userService.findUserById(usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const membresia = await this.membershipService.obtenerMembresia(tarea.team.id, usuarioId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo los propietarios del equipo pueden gestionar etiquetas");
    }

    // Obtener las etiquetas por sus IDs
    const etiquetas = await this.etiquetaRepo
      .createQueryBuilder("etiqueta")
      .where("etiqueta.id IN (:...ids)", { ids: etiquetasIds })
      .getMany();

    if (etiquetas.length !== etiquetasIds.length) {
      throw new Error("Alguna etiqueta no existe");
    }

    tarea.etiquetas = etiquetas;
    return await this.taskRepository.save(tarea);
  }

  async desasignarEtiquetaDeTarea(tareaId: number, etiquetaId: number, usuarioId: number): Promise<Task> {
    const tarea = await this.taskRepo.findOneById(tareaId);
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar permisos del usuario
    const usuario = await this.userService.findUserById(usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const membresia = await this.membershipService.obtenerMembresia(tarea.team.id, usuarioId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo los propietarios del equipo pueden gestionar etiquetas");
    }

    // Filtrar las etiquetas, removiendo la que se desea desasignar
    tarea.etiquetas = tarea.etiquetas.filter(etiqueta => etiqueta.id !== etiquetaId);
    return await this.taskRepository.save(tarea);
  }

  async obtenerEtiquetasDeTarea(tareaId: number): Promise<Etiqueta[]> {
  const tarea = await this.taskRepo.findOneById(tareaId);
  if (!tarea) {
    throw new Error("Tarea no encontrada");
  }
  return tarea.etiquetas || []; 
  }

  async obtenerTareasPorEtiqueta(etiquetaId: number, usuarioId: number): Promise<Task[]> {
    const etiqueta = await this.etiquetaService.obtenerEtiquetaPorId(etiquetaId);
    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }

    const usuario = await this.userService.findUserById(usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    if (usuario.rol === "admin") {
      return await this.taskRepository
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.etiquetas", "etiqueta")
        .where("etiqueta.id = :etiquetaId", { etiquetaId })
        .leftJoinAndSelect("task.team", "team")
        .leftJoinAndSelect("task.user", "user")
        .getMany();
    }

    // Para usuarios normales, obtener solo tareas de sus equipos
    const membresias = await this.membershipService.obtenerMembresiasPorUsuario(usuarioId);
    const teamIds = membresias.map(m => m.team.id);

    return await this.taskRepository
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.etiquetas", "etiqueta")
      .where("etiqueta.id = :etiquetaId", { etiquetaId })
      .andWhere("task.team.id IN (:...teamIds)", { teamIds })
      .leftJoinAndSelect("task.team", "team")
      .leftJoinAndSelect("task.user", "user")
      .getMany();
  }
}