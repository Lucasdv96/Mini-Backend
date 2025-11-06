import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.get("/profile", authenticateToken, controller.getProfile);

export default router;