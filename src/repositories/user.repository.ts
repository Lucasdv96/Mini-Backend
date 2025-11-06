import { AppdataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserRepository {
  private repo = AppdataSource.getRepository(User);

  async create(name: string, email: string, password: string, rol: "admin" | "user"): Promise<User> {
    const user = this.repo.create({ name, email, password, rol });
    return await this.repo.save(user);
  }

  async getAll() {
    return await this.repo.find();
  }

  async findById(id: number, includePassword: boolean = false) {
    if (includePassword) {
      return await this.repo.findOne({ where: { id } });
    }
    return await this.repo.findOne({ 
      where: { id },
      select: ['id', 'name', 'email', 'rol']
    });
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async updateUser(id: number, data: Partial<User>) {
    await this.repo.update(id, data);
    return await this.findById(id);
  }

  async deleteUser(id: number) {
    await this.repo.delete(id);
  }
}