import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const { name, rol } = req.body; // ← Solo name y rol, sin teamId
      const user = await userService.createUser(name, rol);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  };

  getUserById = async (_req : Request, res : Response) =>{
    const userid = Number(_req.params.id)
    const user = await userService.findUserById(userid)
    res.json(user)
  }

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, rol } = req.body; // ← Sin teamId aquí también

      const updated = await userService.updateUser(id, { name, rol });
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