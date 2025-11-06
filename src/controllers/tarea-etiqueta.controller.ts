import { Request, Response } from "express";
import { TareaEtiquetaService } from "../services/tarea-etiqueta.service";

const tareaEtiquetaService = new TareaEtiquetaService();

export class TareaEtiquetaController {
  asignarEtiquetas = async (req: Request, res: Response) => {
    try {
      const tareaId = Number(req.params.id);
      const { etiquetasIds, usuarioId } = req.body;

      if (!etiquetasIds || !Array.isArray(etiquetasIds) || !usuarioId) {
        return res.status(400).json({ 
          message: "Se requiere un array de etiquetasIds y usuarioId" 
        });
      }

      const tareaActualizada = await tareaEtiquetaService.asignarEtiquetasATarea(tareaId, etiquetasIds, usuarioId);
      return res.json(tareaActualizada);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  desasignarEtiqueta = async (req: Request, res: Response) => {
    try {
      const tareaId = Number(req.params.id);
      const etiquetaId = Number(req.params.etiquetaId);
      const { usuarioId } = req.body;

      if (!usuarioId) {
        return res.status(400).json({ message: "Se requiere usuarioId" });
      }

      const tareaActualizada = await tareaEtiquetaService.desasignarEtiquetaDeTarea(tareaId, etiquetaId, usuarioId);
      return res.json(tareaActualizada);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  obtenerEtiquetasDeTarea = async (req: Request, res: Response) => {
    try {
      const tareaId = Number(req.params.id);
      const etiquetas = await tareaEtiquetaService.obtenerEtiquetasDeTarea(tareaId);
      return res.json(etiquetas);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  obtenerTareasPorEtiqueta = async (req: Request, res: Response) => {
    try {
      const etiquetaId = Number(req.params.etiquetaId);
      const { usuarioId } = req.body;

      if (!usuarioId) {
        return res.status(400).json({ message: "Se requiere usuarioId" });
      }

      const tareas = await tareaEtiquetaService.obtenerTareasPorEtiqueta(etiquetaId, usuarioId);
      return res.json(tareas);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}