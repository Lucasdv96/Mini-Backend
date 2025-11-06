import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { AppdataSource } from '../config/data-source';

export class AuthService {
  private userRepository = AppdataSource.getRepository(User);

  async registerUser(name: string, email: string, password: string, rol: "admin" | "user" = "user"): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      rol
    });

    return await this.userRepository.save(user);
  }

  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // SOLUCIÓN SIMPLIFICADA - Sin opciones complejas
    const payload = { 
      id: user.id, 
      email: user.email, 
      rol: user.rol 
    };
    
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(payload, secret);

    return { user, token };
  }

  verifyToken(token: string): any {
    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}