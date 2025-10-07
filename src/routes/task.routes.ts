import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const controller = new TaskController();

router.post("/", controller.create);         // admin crea tarea
router.get("/:id", controller.getAll);          // ver todas
router.put("/:id/complete", controller.markCompleted); // user marca como completa
router.delete("/:id", controller.delete);    // admin borra tarea
router.put("/:id", controller.update);       // admin actualiza tarea


export default router;
