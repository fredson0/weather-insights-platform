import { User, CreateUserDTO, UpdateUserDTO } from '../entities/user.entity';

/**
 * Interface de repositório para entidade User
 * Segue o padrão Repository da Clean Architecture
 */
export interface IUserRepository {
  /**
   * Criar um novo usuário
   */
  create(data: CreateUserDTO): Promise<User>;

  /**
   * Buscar usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Buscar usuário por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Buscar todos os usuários com filtros opcionais
   */
  findAll(filters?: {
    role?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<User[]>;

  /**
   * Atualizar usuário por ID
   */
  update(id: string, data: UpdateUserDTO): Promise<User | null>;

  /**
   * Deletar usuário por ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Contar total de usuários
   */
  count(filters?: { role?: string; isActive?: boolean }): Promise<number>;

  /**
   * Verificar se email existe
   */
  emailExists(email: string): Promise<boolean>;
}
