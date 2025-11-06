import { AppdataSource } from "../config/data-source";
import { Membership, RolMembresia } from "../entities/membership.entity";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";

export class MembershipRepository {
  private repo = AppdataSource.getRepository(Membership);

  async create(membershipData: Partial<Membership>) {
    const membership = this.repo.create(membershipData);
    return await this.repo.save(membership);
  }

  async findOne(options: any) {
    return await this.repo.findOne({
      where: options.where,
      relations: options.relations || []
    });
  }

  async find(options: any) {
    return await this.repo.find({
      where: options.where,
      relations: options.relations || []
    });
  }

  async remove(membership: Membership) {
    await this.repo.remove(membership);
  }

  async save(membership: Membership) {
    return await this.repo.save(membership);
  }
}