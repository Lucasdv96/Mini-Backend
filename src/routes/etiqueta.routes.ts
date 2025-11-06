import { Router } from "express";
import { EtiquetaController } from "../controllers/etiqueta.controller";

const router = Router();
const controller = new EtiquetaController();

router.post("/", controller.crearEtiqueta);
router.get("/", controller.listarEtiquetas);
router.get("/:id", controller.obtenerEtiqueta);
router.put("/:id", controller.actualizarEtiqueta);
router.delete("/:id", controller.eliminarEtiqueta);

export default router;