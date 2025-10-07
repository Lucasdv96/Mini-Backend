import { AppdataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";

export class UserRepository {
  private repo = AppdataSource.getRepository(User);

  async create(name: string, rol: "admin" | "user", team: Team): Promise<User> {
    const user = this.repo.create({ name, rol, team });
    return await this.repo.save(user);
  }


  async getAll() {
    return await this.repo.find({ relations: ["team"] });
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ["team"] });
  }

  // nuevo: asignar equipo a un usuario
  async assignTeam(userId: number, team: Team) {
    const user = await this.findById(userId);
    if (!user) return null;
    user.team = team;
    return await this.repo.save(user);
  }

async updateUser(id: number, data: Partial<User>) {
  const user = await this.findById(id);
  if (!user) throw new Error("El usuario no existe");

  Object.assign(user, data);
  return await this.repo.save(user);
}

async deleteUser(id: number) {
  await this.repo.delete(id);
}


}

