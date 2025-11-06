import {Router} from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const controller = new UserController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id",controller.getUserById)
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;