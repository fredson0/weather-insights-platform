import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
} from '../../../core/domain/entities/user.entity';
import { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { UserDocument } from '../mongodb/schemas/user.schema';

/**
 * Implementação MongoDB do repositório de usuários
 * Responsabilidade: Persistência de dados (sem lógica de negócio)
 */
@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  private mapToEntity(doc: any): User {
    return {
      id: doc._id?.toString() || doc.id,
      email: doc.email,
      name: doc.name,
      password: doc.password,
      role: doc.role,
      isActive: doc.isActive ?? true,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
  }

  /** Cria um novo usuário */
  async create(data: CreateUserDTO): Promise<User> {
    const user = new this.userModel(data);
    const saved = await user.save();
    return this.mapToEntity(saved.toObject());
  }

  /** Busca usuário por ID */
  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapToEntity(user.toObject()) : null;
  }

  /** Busca usuário por email */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.mapToEntity(user.toObject()) : null;
  }

  /** Busca todos os usuários com filtros opcionais */
  async findAll(filters?: {
    role?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const query = this.userModel.find();

    if (filters?.role) {
      query.where('role').equals(filters.role);
    }

    if (filters?.isActive !== undefined) {
      query.where('isActive').equals(filters.isActive);
    }

    if (filters?.offset) {
      query.skip(filters.offset);
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    const users = await query.exec();
    return users.map((user) => this.mapToEntity(user.toObject()));
  }

  /** Atualiza usuário por ID */
  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    const user = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return user ? this.mapToEntity(user.toObject()) : null;
  }

  /** Deleta usuário por ID */
  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  /** Conta usuários com filtros opcionais */
  async count(filters?: { role?: string; isActive?: boolean }): Promise<number> {
    const query: any = {};

    if (filters?.role) {
      query.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    return await this.userModel.countDocuments(query).exec();
  }

  /** Verifica se email já existe */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ email }).exec();
    return count > 0;
  }
}
