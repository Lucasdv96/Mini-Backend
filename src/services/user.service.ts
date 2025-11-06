import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "./auth.service";
import bcrypt from 'bcryptjs';

export class UserService {
    private userRepo = new UserRepository();
    private authService = new AuthService();

    async createUser(name: string, email: string, password: string, rol: "admin" | "user" = "user"): Promise<User> {
        return await this.authService.registerUser(name, email, password, rol);
    }

    async getAllUsers(): Promise<Partial<User>[]> {
        const users = await this.userRepo.getAll();
        // No devolver contraseñas
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    async findUserById(id: number): Promise<Partial<User> | null> {
        const user = await this.userRepo.findById(id);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    async updateUser(
        id: number,
        data: { name?: string; email?: string; rol?: "admin" | "user" }
    ): Promise<Partial<User>> {
        const user = await this.userRepo.findById(id, true); // Incluir password para la actualización
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

        if (data.email) {
            if (!data.email.trim()) throw new Error("El email no puede estar vacío");
            user.email = data.email;
        }

        const updatedUser = await this.userRepo.updateUser(id, user);
    
        if (!updatedUser) {
            throw new Error("Error al actualizar el usuario");
        }
        
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("El usuario no existe");

        await this.userRepo.deleteUser(id);
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepo.findById(userId, true); 
        if (!user) throw new Error("Usuario no encontrado");

        // Verificar contraseña actual
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new Error("Contraseña actual incorrecta");
        }

        // Hash nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        await this.userRepo.updateUser(userId, user);
    }
}