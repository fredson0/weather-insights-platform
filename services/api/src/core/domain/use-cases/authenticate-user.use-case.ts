import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';

export interface IAuthenticateUserUseCase {
  execute(email: string, password: string): Promise<User | null>;
}

/**
 * Caso de Uso: Autenticar usuário com email e senha
 * Regras de negócio:
 * - Usuário deve existir e estar ativo
 * - Senha deve coincidir
 */
export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) return null;

    if (!user.isActive) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
