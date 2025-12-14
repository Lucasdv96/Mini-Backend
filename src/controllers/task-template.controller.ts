import { Request, Response } from "express";
import { TaskTemplateService } from "../services/task-template.service";
import { TaskService } from "../services/task.service"; 
const taskTemplateService = new TaskTemplateService();
const taskService = new TaskService();

export class TaskTemplateController {
  createTemplate = async (req: Request, res: Response) => {
    try {
      const { name, description, defaultPriority, defaultDueDate } = req.body;
      const userId = Number(req.body.userId);
      const teamId = req.body.teamId ? Number(req.body.teamId) : undefined;
      const tagIds: number[] = req.body.tagIds || [];
      const template = await taskTemplateService.createTemplate(
        name,
        description,
        defaultPriority,
        userId,
        teamId,
        tagIds,
      );
      return res.status(201).json(template);
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

  getTemplatePreview = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "userId es requerido" });
      }

      const preview = await taskTemplateService.getTemplatePreview(id, Number(userId));
      return res.json(preview);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
  getAll = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const templates = await taskTemplateService.listTemplates(
        userId,
        teamId,
        search,
        page,
        limit
      );
      return res.json(templates);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
  deleteTemplate = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.body;
      await taskTemplateService.deleteTemplate(id, Number(userId));
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}