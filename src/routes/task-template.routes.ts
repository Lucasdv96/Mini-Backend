import { Router } from "express";
import { TaskTemplateController } from "../controllers/task-template.controller";

const router = Router();
const controller = new TaskTemplateController();

// Crear template
router.post("/", controller.createTemplate);

// Listar templates (con filtros y paginación)
router.get("/", controller.getAll);

// Obtener template específico
//router.get("/:id", controller);

// Obtener preview de template para prellenar formulario
router.get("/:id/preview", controller.getTemplatePreview);

// Actualizar template
router.put("/:id", controller.update);

// Eliminar template
router.delete("/:id", controller.deleteTemplate);

export default router;