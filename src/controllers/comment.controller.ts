import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();

export class CommentController {
  crearComentario = async (req: Request, res: Response) => {
    try {
      const { contenido, usuarioId } = req.body;
      const tareaId = Number(req.params.tareaId);

      if (!contenido || !usuarioId) {
        return res.status(400).json({ message: "Faltan parámetros: contenido y usuarioId" });
      }

      const comentario = await commentService.crearComentario(contenido, tareaId, usuarioId);
      return res.status(201).json(comentario);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  obtenerComentariosDeTarea = async (req: Request, res: Response) => {
  try {
    const tareaId = Number(req.params.tareaId);
    // CAMBIO IMPORTANTE: Obtener usuarioId de query parameters en lugar del body
    const { usuarioId } = req.query; // Cambiar de req.body a req.query

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere usuarioId" });
    }

    const comentarios = await commentService.obtenerComentariosPorTarea(tareaId, Number(usuarioId));
    return res.json(comentarios);
  } catch (err: any) {
    console.error('Error en obtenerComentariosDeTarea:', err);
    return res.status(400).json({ message: err.message });
  }
};

  actualizarComentario = async (req: Request, res: Response) => {
    try {
      const commentId = Number(req.params.commentId);
      const { contenido, usuarioId } = req.body;

      if (!contenido || !usuarioId) {
        return res.status(400).json({ message: "Faltan parámetros: contenido y usuarioId" });
      }

      const comentarioActualizado = await commentService.actualizarComentario(commentId, contenido, usuarioId);
      return res.json(comentarioActualizado);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  eliminarComentario = async (req: Request, res: Response) => {
    try {
      const commentId = Number(req.params.commentId);
      const { usuarioId } = req.body;

      if (!usuarioId) {
        return res.status(400).json({ message: "Se requiere usuarioId" });
      }

      await commentService.eliminarComentario(commentId, usuarioId);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}