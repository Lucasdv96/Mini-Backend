import {Router} from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

// Registro público - cualquier persona puede crear usuario
router.post("/", controller.create);

// Listar usuarios requiere autenticación
router.get("/", authenticateToken, controller.getAll);

// Actualizar usuario requiere autenticación (cada usuario actualiza su propio perfil)
router.put("/:id", authenticateToken, controller.update);

// Eliminar usuario requiere autenticación (pero no necesariamente ser admin)
router.delete("/:id", authenticateToken, controller.delete);

// Cambiar contraseña requiere autenticación
router.put("/:id/password", authenticateToken, controller.changePassword);

export default router;