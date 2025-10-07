import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";

export class UserService {
    private userRepo = new UserRepository();

    async createUser(name: string, rol: "admin" | "user", teamId: number): Promise<User> {
        if (!name || !name.trim()) throw new Error("El nombre no puede estar vacío");

        rol = rol.toLowerCase() as "admin" | "user";
        if (rol !== "admin" && rol !== "user") throw new Error("El rol debe ser 'admin' o 'user'");
        // buscar el equipo
        const teamRepo = AppdataSource.getRepository(Team);
        const team = await teamRepo.findOneBy({ id: teamId });
        if (!team) throw new Error("El equipo no existe");

        // crear usuario asociado al equipo
        return await this.userRepo.create(name, rol, team);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepo.getAll();
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.userRepo.findById(id);
    }

    async updateUser(
        id: number,
        data: { name?: string; rol?: "admin" | "user"; teamId?: number }
): Promise<User> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("El usuario no existe");

  // Si cambia el rol
        if (data.rol) {
            const newRol = data.rol.toLowerCase() as "admin" | "user";
            if (newRol !== "admin" && newRol !== "user") {
                throw new Error("El rol debe ser 'admin' o 'user'");
    }
    user.rol = newRol;
    }

  // Si cambia el nombre
    if (data.name) {
        if (!data.name.trim()) throw new Error("El nombre no puede estar vacío");
        user.name = data.name;
    }

  // Si cambia el team
    if (data.teamId) {
        const teamRepo = AppdataSource.getRepository(Team);
        const team = await teamRepo.findOneBy({ id: data.teamId });
        if (!team) throw new Error("El equipo no existe");
        user.team = team;
    }

    return await this.userRepo.updateUser(id, user);
}

async deleteUser(id: number): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("El usuario no existe");

    await this.userRepo.deleteUser(id);
}


}
