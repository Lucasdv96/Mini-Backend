import { AppdataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";
import { Team } from "../entities/team.entity";

export class TaskRepository {
  private repo = AppdataSource.getRepository(Task);

  async create(title: string, description: string, teamId: number) {
    const teamRepo = AppdataSource.getRepository(Team);
    const team = await teamRepo.findOneBy({ id: teamId });
    if (!team) throw new Error("El equipo no existe");

    const task = this.repo.create({ title, description, completed: false, team });
    return await this.repo.save(task);
  }

  async getAll() {
    return await this.repo.find({ relations: ["team"] });
  }

  async markCompleted(id: number) {
    const task = await this.repo.findOne({ where: { id }, relations: ["team"] });
    if (!task) return null;
    task.completed = true;
    return await this.repo.save(task);
  }

  async findOneById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ["team"] });
  }

  async deleteTask(id: number) {
    await this.repo.delete(id);
  }
}
