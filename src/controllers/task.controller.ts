import { Request, Response } from "express";
import { TaskService } from "../services/task.service";

const taskService = new TaskService();

export class TaskController {
  create = async (req: Request, res: Response) => {
    try {
      const { title, description, teamId, userId } = req.body;
      const task = await taskService.createTask(title, description, teamId, Number(userId));
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  };

  markCompleted = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.body;
      const task = await taskService.markTaskComplete(id, Number(userId));
      return res.json(task);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.body;
      await taskService.deleteTask(id, Number(userId));
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };


  
update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { userId, title, description, priority } = req.body;

    const updated = await taskService.updateTask(id, Number(userId), {
      title,
      description,
      priority,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

}
