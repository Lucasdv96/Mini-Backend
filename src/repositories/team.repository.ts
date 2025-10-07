import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";

export class TeamRepository {
  private repo = AppdataSource.getRepository(Team);

  async create(name: string) {
    const team = this.repo.create({ name });
    return await this.repo.save(team);
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ["users"] });
  }

  async getAll() {
    return await this.repo.find({ relations: ["users"] });
  }
  //NUEVO: UPDATE
  async update(id: number, name: string) {
    const team = await this.repo.findOneBy({ id });
    if (!team) throw new Error("Equipo no encontrado");
    team.name = name;
    return await this.repo.save(team);
  }
  //NUEVO: DELETE
  async delete(id: number) {
    const team = await this.repo.findOneBy({ id });
    if (!team) throw new Error("Equipo no encontrado");
    return await this.repo.remove(team);
  }

}
