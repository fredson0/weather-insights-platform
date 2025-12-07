import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

/**
 * Seed de usuário padrão
 * Cria automaticamente admin@example.com na inicialização
 */
@Injectable()
export class UserSeed implements OnModuleInit {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser() {
    try {
      const defaultEmail = process.env.DEFAULT_USER_EMAIL || 'admin@example.com';
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD || '123456';
      const defaultName = process.env.DEFAULT_USER_NAME || 'Admin';

      // Verificar se já existe
      const existingUser = await this.userModel.findOne({ email: defaultEmail }).exec();
      
      if (existingUser) {
        console.log('Usuário padrão já existe:', defaultEmail);
        return;
      }

      // Criar usuário padrão
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const defaultUser = new this.userModel({
        name: defaultName,
        email: defaultEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });

      await defaultUser.save();
      
      console.log('Usuário padrão criado com sucesso!');
      console.log(`Email: ${defaultEmail}`);
      console.log(`Senha: ${defaultPassword}`);
    } catch (error) {
      console.error('❌ Erro ao criar usuário padrão:', error.message);
    }
  }
}
