import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
      }

      const { user, token } = await authService.loginUser(email, password);

      // No devolver la contraseña
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      // El middleware auth ya agregó el usuario a req
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      res.json({
        id: user.id,
        email: user.email,
        rol: user.rol
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}