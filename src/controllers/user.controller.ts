import { Request, Response } from "express";
import { UserService } from "../services/user.service";


const userService = new UserService();

export class UserController {
  create = async (req: Request, res: Response) => {
    try {
      // CORRECCIÓN: Usa 'rol' y 'teamId' para que coincidan con el servicio
      const { name, rol, teamId } = req.body;
      const user = await userService.createUser(name, rol, teamId);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  };

  update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, rol, teamId } = req.body;

    const updated = await userService.updateUser(id, { name, rol, teamId });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

delete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

}
