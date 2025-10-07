import { Router } from "express";
import { TeamController } from "../controllers/team.controller";

const router = Router();
const controller = new TeamController();

router.post("/", controller.create); // crear equipo
router.post("/:teamId/users/:userId", controller.addUser); // asignar usuario a equipo
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update); //NUEVO: UPDATE
router.delete("/:id", controller.delete); //NUEVO: DELETE

export default router;
