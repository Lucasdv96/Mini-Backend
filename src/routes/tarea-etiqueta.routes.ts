import { Router } from "express";
import { TareaEtiquetaController } from "../controllers/tarea-etiqueta.controller";

const router = Router();
const controller = new TareaEtiquetaController();

router.put("/tareas/:id/etiquetas", controller.asignarEtiquetas);
router.delete("/tareas/:id/etiquetas/:etiquetaId", controller.desasignarEtiqueta);
router.get("/tareas/:id/etiquetas", controller.obtenerEtiquetasDeTarea);
router.post("/etiquetas/:etiquetaId/tareas", controller.obtenerTareasPorEtiqueta);

export default router;