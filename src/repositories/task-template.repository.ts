import { AppdataSource } from "../config/data-source";
import { TaskTemplate, PriorityTemplate } from "../entities/task-template.entity";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";
import { Etiqueta } from "../entities/etiqueta.entity";
import { In } from "typeorm";

export class TaskTemplateRepository {
  private repo = AppdataSource.getRepository(TaskTemplate);

  async create(
    name: string,
    description: string | undefined,
    priority: PriorityTemplate,
    creatorId: number,
    teamId: number | undefined,
    tagIds: number[]
  ): Promise<TaskTemplate> {
    const userRepo = AppdataSource.getRepository(User);
    const teamRepo = AppdataSource.getRepository(Team);
    const etiquetaRepo = AppdataSource.getRepository(Etiqueta);

    const creator = await userRepo.findOneBy({ id: creatorId });
    if (!creator) throw new Error("El creador no existe");

    let team: Team | undefined = undefined;
    if (teamId) {
      const foundTeam = await teamRepo.findOneBy({ id: teamId });
      if (!foundTeam) throw new Error("El equipo no existe");
      team = foundTeam;
    }

    let tags: Etiqueta[] = [];
    if (tagIds.length > 0) {
      tags = await etiquetaRepo.findBy({ id: In(tagIds) });
      if (tags.length !== tagIds.length) {
        throw new Error("Algunos tags no existen");
      }
    }

    const template = new TaskTemplate();
    template.name = name;
    if (description !== undefined) {
      template.description = description;
    }
    template.priority = priority;
    template.creator = creator;
    if (team !== undefined) {
      template.team = team;
    }
    template.tags = tags;

    return await this.repo.save(template);
  }

  async findAll(
    creatorId: number,
    teamId?: number,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ templates: TaskTemplate[]; total: number }> {
    const query = this.repo
      .createQueryBuilder("template")
      .leftJoinAndSelect("template.creator", "creator")
      .leftJoinAndSelect("template.team", "team")
      .leftJoinAndSelect("template.tags", "tags")
      .where("template.creator.id = :creatorId", { creatorId });

    if (teamId) {
      query.andWhere("template.team.id = :teamId", { teamId });
    }

    if (search) {
      query.andWhere(
        "(template.name LIKE :search OR template.description LIKE :search)",
        { search: `%${search}%` }
      );
    }

    query
      .orderBy("template.updatedAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [templates, total] = await query.getManyAndCount();

    return { templates, total };
  }

  async findById(id: number): Promise<TaskTemplate | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["creator", "team", "tags"],
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      priority?: PriorityTemplate;
      teamId?: number | null;
      tagIds?: number[];
    }
  ): Promise<TaskTemplate> {
    const template = await this.repo.findOne({
      where: { id },
      relations: ["tags"],
    });

    if (!template) throw new Error("Template no encontrada");

    if (data.name) template.name = data.name;
    if (data.description !== undefined) template.description = data.description;
    if (data.priority) template.priority = data.priority;

    if (data.teamId !== undefined) {
      if (data.teamId === null) {
        // No asignamos nada, dejamos que el campo opcional permanezca sin valor
        // TypeORM manejará esto correctamente
      } else {
        const teamRepo = AppdataSource.getRepository(Team);
        const team = await teamRepo.findOneBy({ id: data.teamId });
        if (!team) throw new Error("El equipo no existe");
        template.team = team;
      }
    }

    if (data.tagIds !== undefined) {
      const etiquetaRepo = AppdataSource.getRepository(Etiqueta);
      const tags = await etiquetaRepo.findBy({ id: In(data.tagIds) });
      if (tags.length !== data.tagIds.length) {
        throw new Error("Algunos tags no existen");
      }
      template.tags = tags;
    }

    return await this.repo.save(template);
  }

  async delete(id: number): Promise<void> {
    const template = await this.repo.findOneBy({ id });
    if (!template) throw new Error("Template no encontrada");
    await this.repo.remove(template);
  }

  async existsByNameAndCreator(name: string, creatorId: number, excludeId?: number): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder("template")
      .where("template.name = :name", { name })
      .andWhere("template.creator.id = :creatorId", { creatorId });

    if (excludeId) {
      query.andWhere("template.id != :excludeId", { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}