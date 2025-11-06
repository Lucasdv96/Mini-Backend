import { AppdataSource } from "../config/data-source";
import { Task, EstadoTarea } from "../entities/task.entity";
import { HistorialEstado } from "../entities/historial-estado.entity";
import { User } from "../entities/user.entity";
import { MembershipService } from "./membership.service";
import { UserService } from "./user.service";

export class EstadoService {
  private taskRepo = AppdataSource.getRepository(Task);
  private historialRepo = AppdataSource.getRepository(HistorialEstado);
  private userRepo = AppdataSource.getRepository(User);
  private membershipService = new MembershipService();
  private userService = new UserService();

  private transicionesValidas = {
    [EstadoTarea.PENDIENTE]: [EstadoTarea.EN_CURSO, EstadoTarea.CANCELADA],
    [EstadoTarea.EN_CURSO]: [EstadoTarea.FINALIZADA, EstadoTarea.CANCELADA, EstadoTarea.PENDIENTE],
    [EstadoTarea.FINALIZADA]: [EstadoTarea.EN_CURSO, EstadoTarea.CANCELADA],
    [EstadoTarea.CANCELADA]: [EstadoTarea.PENDIENTE, EstadoTarea.EN_CURSO]
  };

  async cambiarEstado(tareaId: number, nuevoEstado: EstadoTarea, usuarioId: number): Promise<Task> {
    const tarea = await this.taskRepo.findOne({ 
      where: { id: tareaId }, 
      relations: ["team", "user"] 
    });

    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }

    const usuario = await this.userService.findUserById(usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar que el usuario pertenece al equipo de la tarea
    const membresia = await this.membershipService.obtenerMembresia(tarea.team.id, usuarioId);
    if (!membresia) {
      throw new Error("No tienes permisos para modificar esta tarea");
    }

    // Validar transición
    if (!this.transicionesValidas[tarea.estado]?.includes(nuevoEstado)) {
      throw new Error(`Transición no válida: ${tarea.estado} -> ${nuevoEstado}`);
    }

    // Restricciones para tareas finalizadas/canceladas
    if (tarea.estado === EstadoTarea.FINALIZADA || tarea.estado === EstadoTarea.CANCELADA) {
      throw new Error("No se puede modificar una tarea finalizada o cancelada");
    }

    const estadoAnterior = tarea.estado;
    tarea.estado = nuevoEstado;

    // Guardar historial
    const historial = this.historialRepo.create({
      tarea,
      estadoAnterior,
      estadoNuevo: nuevoEstado,
      usuario
    });

    await this.historialRepo.save(historial);
    return await this.taskRepo.save(tarea);
  }

  async obtenerHistorial(tareaId: number): Promise<HistorialEstado[]> {
    return await this.historialRepo.find({
      where: { tarea: { id: tareaId } },
      relations: ["usuario"],
      order: { fecha: "DESC" }
    });
  }

  async getTareasPorEstado(equipoId: number, estado: EstadoTarea): Promise<Task[]> {
    return await this.taskRepo.find({
      where: { 
        team: { id: equipoId },
        estado: estado
      },
      relations: ["user", "team"]
    });
  }
}