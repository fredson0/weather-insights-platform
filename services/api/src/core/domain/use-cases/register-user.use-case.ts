import * as bcrypt from 'bcrypt';
import { User, CreateUserDTO, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';

export interface IRegisterUserUseCase {
  execute(data: CreateUserDTO): Promise<User>;
}

/**
 * Caso de Uso: Registrar um novo usuário
 * Regras de negócio:
 * - Email deve ser único
 * - Senha deve ser hasheada
 * - Role padrão é USER se não especificado
 */
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const emailExists = await this.userRepository.findByEmail(data.email);
    if (emailExists) {
        throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData: CreateUserDTO = {
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
        password: hashedPassword,
        role: data.role || UserRole.USER,
    };

    const user = await this.userRepository.create(userData);
    return user;
    
  }
}
