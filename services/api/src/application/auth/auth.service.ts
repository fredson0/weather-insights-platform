import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserUseCase } from '../../core/domain/use-cases/register-user.use-case';
import { AuthenticateUserUseCase } from '../../core/domain/use-cases/authenticate-user.use-case';
import { User } from '../../core/domain/entities/user.entity';

/**
 * Serviço de autenticação
 * 
 * RESPONSABILIDADE: Orquestrar casos de uso de autenticação e gerar tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra novo usuário
   */
  async register(email: string, password: string, name: string): Promise<User> {
    return await this.registerUserUseCase.execute({ email, password, name });
  }

  /**
   * Autentica usuário e retorna token JWT
   */
  async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.authenticateUserUseCase.execute({ email, password });

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }

  /**
   * Valida token JWT e retorna dados do usuário
   */
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Valida senha comparando hash
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
