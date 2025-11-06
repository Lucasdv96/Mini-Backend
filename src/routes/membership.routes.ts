import { Router } from "express";
import { MembershipController } from "../controllers/membership.controller";

const router = Router();
const controller = new MembershipController();

router.post("/:id/miembros", controller.agregarMiembro);
router.delete("/:id/miembros/:usuarioId", controller.removerMiembro);
router.get("/:id/miembros", controller.listarMiembros);
router.put("/:id/miembros/:usuarioId", controller.cambiarRol);

export default router;