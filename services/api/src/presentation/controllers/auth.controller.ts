import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../application';
import { RegisterDTO, LoginDTO } from '../dtos/auth';

/**
 * Controller de autenticação (rotas públicas)
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto.email, dto.password, dto.name, dto.role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto.email, dto.password);
  }
}
