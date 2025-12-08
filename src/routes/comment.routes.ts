import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";

const router = Router();
const controller = new CommentController();

router.post("/tareas/:tareaId/comentarios", controller.crearComentario);
router.get("/tareas/:tareaId/comentarios", controller.obtenerComentariosDeTarea);
router.put("/comentarios/:commentId", controller.actualizarComentario);
router.delete("/comentarios/:commentId", controller.eliminarComentario);

export default router;