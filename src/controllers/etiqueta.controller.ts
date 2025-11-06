import { Request, Response } from "express";
import { EtiquetaService } from "../services/etiqueta.service";

const etiquetaService = new EtiquetaService();

export class EtiquetaController {
  crearEtiqueta = async (req: Request, res: Response) => {
    try {
      const { nombre, color } = req.body;
      const etiqueta = await etiquetaService.crearEtiqueta(nombre, color);
      return res.status(201).json(etiqueta);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  listarEtiquetas = async (req: Request, res: Response) => {
    try {
      const etiquetas = await etiquetaService.listarEtiquetas();
      return res.json(etiquetas);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  obtenerEtiqueta = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const etiqueta = await etiquetaService.obtenerEtiquetaPorId(id);
      if (!etiqueta) {
        return res.status(404).json({ message: "Etiqueta no encontrada" });
      }
      return res.json(etiqueta);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  actualizarEtiqueta = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nombre, color } = req.body;
      const etiqueta = await etiquetaService.actualizarEtiqueta(id, nombre, color);
      return res.json(etiqueta);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  eliminarEtiqueta = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await etiquetaService.eliminarEtiqueta(id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}