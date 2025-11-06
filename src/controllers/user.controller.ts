import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const { name, email, password, rol = "user" } = req.body; // Rol por defecto "user"
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
      }

      const user = await userService.createUser(name, email, password, rol);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, email, rol } = req.body;

      // Verificar que el usuario solo pueda actualizar su propio perfil
      const currentUserId = (req as any).user?.id;
      if (currentUserId !== id) {
        return res.status(403).json({ message: "Solo puedes actualizar tu propio perfil" });
      }

      const updated = await userService.updateUser(id, { name, email, rol });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      // Verificar que el usuario solo pueda eliminar su propia cuenta
      const currentUserId = (req as any).user?.id;
      if (currentUserId !== id) {
        return res.status(403).json({ message: "Solo puedes eliminar tu propia cuenta" });
      }

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      
      // Verificar que el usuario solo pueda cambiar su propia contraseña
      const currentUserId = (req as any).user?.id;
      if (currentUserId !== userId) {
        return res.status(403).json({ message: "Solo puedes cambiar tu propia contraseña" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Contraseña actual y nueva contraseña son requeridas" });
      }

      await userService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: "Contraseña actualizada exitosamente" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}