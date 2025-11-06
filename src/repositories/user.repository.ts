import { AppdataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserRepository {
  private repo = AppdataSource.getRepository(User);

  async create(name: string, rol: "admin" | "user"): Promise<User> {
    const user = this.repo.create({ name, rol });
    return await this.repo.save(user);
  }

  async getAll() {
    return await this.repo.find();
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id } });
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