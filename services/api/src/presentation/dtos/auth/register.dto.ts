import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * DTO de registro de usuário
 */
export class RegisterDTO {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Role deve ser uma string' })
  role?: string;
}
