import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from '../presentation/controllers';
import { AuthService } from '../application';
import { UserSchema } from '../infrastructure/database/mongodb/schemas/user.schema';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import { RegisterUserUseCase } from '../core/domain/use-cases/users/register-user.use-case';
import { AuthenticateUserUseCase } from '../core/domain/use-cases/users/authenticate-user.use-case';

/**
 * Módulo de Autenticação
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IUserRepository',
      useClass: MongoUserRepository,
    },
    RegisterUserUseCase,
    AuthenticateUserUseCase,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
