import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../core/domain/repositories/user.repository.interface';
import { User, UpdateUserDTO } from '../../core/domain/entities/user.entity';

/**
 * Serviço de gerenciamento de usuários
 * 
 * RESPONSABILIDADE: Orquestrar operações CRUD de usuários
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Busca usuário por ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  /**
   * Busca usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Lista todos os usuários com filtros opcionais
   */
  async findAll(filters?: {
    role?: string;
    isActive?: boolean;
    offset?: number;
    limit?: number;
  }): Promise<User[]> {
    return await this.userRepository.findAll(filters);
  }

  /**
   * Atualiza usuário
   */
  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  /**
   * Deleta usuário
   */
  async delete(id: string): Promise<boolean> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return deleted;
  }

  /**
   * Conta total de usuários
   */
  async count(filters?: { role?: string; isActive?: boolean }): Promise<number> {
    return await this.userRepository.count(filters);
  }
}
