import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    private userRepo = new UserRepository();

    async createUser(name: string, rol: "admin" | "user"): Promise<User> {
        if (!name || !name.trim()) throw new Error("El nombre no puede estar vacío");

        rol = rol.toLowerCase() as "admin" | "user";
        if (rol !== "admin" && rol !== "user") throw new Error("El rol debe ser 'admin' o 'user'");

        // Crear usuario sin equipo inicial
        return await this.userRepo.create(name, rol);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepo.getAll();
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.userRepo.findById(id);
    }

    async updateUser(
        id: number,
        data: { name?: string; rol?: "admin" | "user" }
    ): Promise<User> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("El usuario no existe");

        if (data.rol) {
            const newRol = data.rol.toLowerCase() as "admin" | "user";
            if (newRol !== "admin" && newRol !== "user") {
                throw new Error("El rol debe ser 'admin' o 'user'");
            }
            user.rol = newRol;
        }

        if (data.name) {
            if (!data.name.trim()) throw new Error("El nombre no puede estar vacío");
            user.name = data.name;
        }

        return await this.userRepo.updateUser(id, user);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("El usuario no existe");

        await this.userRepo.deleteUser(id);
    }
}