import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../../core/domain/entities/user.entity';

/**
 * Schema do MongoDB para User
 * Mapeia a entidade User do domínio para uma coleção no MongoDB
 */
@Schema({ 
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  collection: 'users' // Nome da coleção no MongoDB
})
export class UserDocument extends Document {
  /**
   * Email do usuário (único)
   */
  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true, // Salva sempre em minúsculas
    trim: true
  })
  email: string;

  /**
   * Nome completo do usuário
   */
  @Prop({ required: true, trim: true })
  name: string;

  /**
   * Senha hasheada (bcrypt)
   */
  @Prop({ required: true })
  password: string;

  /**
   * Role/Perfil do usuário
   */
  @Prop({ 
    type: String,
    enum: Object.values(UserRole), // Valida que só aceita valores do enum
    default: UserRole.USER 
  })
  role: UserRole;

  /**
   * Se o usuário está ativo no sistema
   */
  @Prop({ default: true })
  isActive: boolean;

  // timestamps: true adiciona automaticamente:
  // createdAt: Date
  // updatedAt: Date
}

/**
 * Factory que cria o Schema do Mongoose a partir da classe
 */
export const UserSchema = SchemaFactory.createForClass(UserDocument);

/**
 * Índices para otimizar queries
 */
UserSchema.index({ email: 1 }); // Índice único para email (já tem unique: true)
UserSchema.index({ role: 1 }); // Índice para filtrar por role
UserSchema.index({ isActive: 1 }); // Índice para filtrar por status
