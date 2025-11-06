import { Router } from "express";
import { EstadoController } from "../controllers/estado.controller";

const router = Router();
const controller = new EstadoController();

router.put("/tareas/:id/estado", controller.cambiarEstado);
router.get("/tareas/:id/historial", controller.obtenerHistorial);
router.get("/equipos/:equipoId/tareas/:estado", controller.getTareasPorEstado);

export default router;