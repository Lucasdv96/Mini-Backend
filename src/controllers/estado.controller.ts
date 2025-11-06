import { Request, Response } from "express";
import { EstadoService } from "../services/estado.service";
import { EstadoTarea } from "../entities/task.entity";

const estadoService = new EstadoService();

export class EstadoController {
  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const tareaId = Number(req.params.id);
      const { estado, usuarioId } = req.body;

      if (!estado || !usuarioId) {
        return res.status(400).json({ message: "Faltan parámetros: estado y usuarioId" });
      }

      if (!Object.values(EstadoTarea).includes(estado)) {
        return res.status(400).json({ 
          message: "Estado inválido. Use: PENDIENTE, EN_CURSO, FINALIZADA o CANCELADA" 
        });
      }

      const tareaActualizada = await estadoService.cambiarEstado(tareaId, estado, usuarioId);
      return res.json(tareaActualizada);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  obtenerHistorial = async (req: Request, res: Response) => {
    try {
      const tareaId = Number(req.params.id);
      const historial = await estadoService.obtenerHistorial(tareaId);
      return res.json(historial);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  getTareasPorEstado = async (req: Request, res: Response) => {
    try {
      const equipoId = Number(req.params.equipoId);
      const estado = req.params.estado as EstadoTarea;

      if (!Object.values(EstadoTarea).includes(estado)) {
        return res.status(400).json({ message: "Estado inválido" });
      }

      const tareas = await estadoService.getTareasPorEstado(equipoId, estado);
      return res.json(tareas);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}