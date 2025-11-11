import { CommentRepository } from "../repositories/comment.repository";
import { MembershipService } from "./membership.service";
import { UserService } from "./user.service";
import { TaskService } from "./task.service";

export class CommentService {
  private commentRepo = new CommentRepository();
  private membershipService = new MembershipService();
  private userService = new UserService();
  private taskService = new TaskService();

  async crearComentario(contenido: string, tareaId: number, usuarioId: number) {
    if (!contenido || !contenido.trim()) {
      throw new Error("El contenido del comentario no puede estar vacío");
    }

    // Verificar que la tarea existe
    const tarea = await this.taskService.getTaskById(tareaId);
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar que el usuario es miembro del equipo de la tarea
    const membresia = await this.membershipService.obtenerMembresia(tarea.team.id, usuarioId);
    if (!membresia) {
      throw new Error("No tienes permisos para comentar en esta tarea");
    }

    return await this.commentRepo.create(contenido, usuarioId, tareaId);
  }

  async obtenerComentariosPorTarea(tareaId: number, usuarioId: number) {
    // Verificar que la tarea existe y el usuario tiene acceso
    const tarea = await this.taskService.getTaskById(tareaId);
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }

    const membresia = await this.membershipService.obtenerMembresia(tarea.team.id, usuarioId);
    if (!membresia) {
      throw new Error("No tienes permisos para ver los comentarios de esta tarea");
    }

    return await this.commentRepo.findByTareaId(tareaId);
  }

  async actualizarComentario(commentId: number, contenido: string, usuarioId: number) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment) {
      throw new Error("Comentario no encontrado");
    }

    // Verificar que el usuario es el dueño del comentario
    if (comment.usuario.id !== usuarioId) {
      throw new Error("Solo el dueño del comentario puede actualizarlo");
    }

    return await this.commentRepo.update(commentId, contenido);
  }

  async eliminarComentario(commentId: number, usuarioId: number) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment) {
      throw new Error("Comentario no encontrado");
    }

    // Verificar que el usuario es el dueño del comentario O es propietario del equipo
    const membresia = await this.membershipService.obtenerMembresia(comment.tarea.team.id, usuarioId);
    if (comment.usuario.id !== usuarioId && (!membresia || membresia.rol !== "PROPIETARIO")) {
      throw new Error("No tienes permisos para eliminar este comentario");
    }

    await this.commentRepo.remove(comment);
  }
}