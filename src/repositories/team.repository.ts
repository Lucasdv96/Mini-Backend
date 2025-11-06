import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";
import { User } from "../entities/user.entity";

export class TeamRepository {
  private repo = AppdataSource.getRepository(Team);

  async create(name: string, propietario: User) {
    const team = this.repo.create({ name, propietario });
    return await this.repo.save(team);
  }

  async findById(id: number) {
    return await this.repo.findOne({ 
      where: { id }, 
      relations: ["propietario", "memberships", "tasks"]  // ← Relaciones correctas
    });
  }

  async getAll() {
    return await this.repo.find({ 
      relations: ["propietario", "memberships", "tasks"]  // ← Relaciones correctas
    });
  }

  async update(id: number, name: string) {
    const team = await this.repo.findOneBy({ id });
    if (!team) throw new Error("Equipo no encontrado");
    team.name = name;
    return await this.repo.save(team);
  }

  async delete(id: number) {
    const team = await this.repo.findOneBy({ id });
    if (!team) throw new Error("Equipo no encontrado");
    return await this.repo.remove(team);
  }
}