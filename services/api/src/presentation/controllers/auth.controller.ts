import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../application';
import { RegisterDTO, LoginDTO } from '../dtos/auth';

/**
 * Controller de autenticação (rotas públicas)
 */
@ApiTags('1. Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar nova conta',
    description: 'Registra um novo usuário no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439011',
        name: 'João Silva',
        email: 'joao@example.com',
        role: 'user',
        isActive: true,
        createdAt: '2025-12-06T18:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Fazer login',
    description: 'Autentica usuário e retorna token JWT'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto.email, dto.password);
  }
}
