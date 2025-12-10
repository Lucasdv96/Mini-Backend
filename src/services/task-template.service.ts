import { TaskTemplateRepository } from "../repositories/task-template.repository";
import { PriorityTemplate } from "../entities/task-template.entity";
import { MembershipService } from "./membership.service";
import { UserService } from "./user.service";

export class TaskTemplateService {
  private templateRepo = new TaskTemplateRepository();
  private membershipService = new MembershipService();
  private userService = new UserService();

  async createTemplate(
    name: string,
    description: string | undefined,
    priority: PriorityTemplate,
    creatorId: number,
    teamId: number | undefined,
    tagIds: number[]
  ) {
    if (!name || !name.trim()) {
      throw new Error("El nombre del template es requerido");
    }

    // Validar que el usuario existe
    const user = await this.userService.findUserById(creatorId);
    if (!user) {
      throw new Error("El usuario no existe");
    }

    // Validar nombre único por creador
    const exists = await this.templateRepo.existsByNameAndCreator(name, creatorId);
    if (exists) {
      throw new Error("Ya existe un template con ese nombre");
    }

    // Si se especifica team, validar que el usuario es miembro
    if (teamId) {
      const membership = await this.membershipService.obtenerMembresia(teamId, creatorId);
      if (!membership) {
        throw new Error("No eres miembro del equipo especificado");
      }
    }

    return await this.templateRepo.create(
      name,
      description,
      priority,
      creatorId,
      teamId,
      tagIds
    );
  }

  async listTemplates(
    userId: number,
    teamId?: number,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    // Validar que el usuario existe
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("El usuario no existe");
    }

    return await this.templateRepo.findAll(userId, teamId, search, page, limit);
  }

  async getTemplateById(id: number, userId: number) {
    const template = await this.templateRepo.findById(id);
    
    if (!template) {
      throw new Error("Template no encontrado");
    }

    // Validar que el usuario es el creador
    if (template.creator.id !== userId) {
      throw new Error("No tienes permisos para ver este template");
    }

    return template;
  }

  async updateTemplate(
    id: number,
    userId: number,
    data: {
      name?: string;
      description?: string;
      priority?: PriorityTemplate;
      teamId?: number | null;
      tagIds?: number[];
    }
  ) {
    const template = await this.templateRepo.findById(id);
    
    if (!template) {
      throw new Error("Template no encontrado");
    }

    // Validar que el usuario es el creador
    if (template.creator.id !== userId) {
      throw new Error("No tienes permisos para editar este template");
    }

    // Validar nombre único si se está cambiando
    if (data.name && data.name !== template.name) {
      const exists = await this.templateRepo.existsByNameAndCreator(data.name, userId, id);
      if (exists) {
        throw new Error("Ya existe un template con ese nombre");
      }
    }

    // Si se especifica team, validar que el usuario es miembro
    if (data.teamId) {
      const membership = await this.membershipService.obtenerMembresia(data.teamId, userId);
      if (!membership) {
        throw new Error("No eres miembro del equipo especificado");
      }
    }

    return await this.templateRepo.update(id, data);
  }

  async deleteTemplate(id: number, userId: number) {
    const template = await this.templateRepo.findById(id);
    
    if (!template) {
      throw new Error("Template no encontrado");
    }

    // Validar que el usuario es el creador
    if (template.creator.id !== userId) {
      throw new Error("No tienes permisos para eliminar este template");
    }

    await this.templateRepo.delete(id);
  }

  async getTemplatePreview(id: number, userId: number) {
    const template = await this.getTemplateById(id, userId);
    
    return {
      name: template.name,
      description: template.description,
      priority: template.priority,
      teamId: template.team?.id,
      tagIds: template.tags.map(tag => tag.id),
      tags: template.tags,
      originTemplateId: id
    };
  }
}