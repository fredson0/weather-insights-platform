import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from '../presentation/controllers';
import { UserService } from '../application';
import { UserSchema } from '../infrastructure/database/mongodb/schemas/user.schema';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import { GetUserByIdUseCase } from '../core/domain/use-cases/users/get-user-by-id.use-case';
import { GetUsersUseCase } from '../core/domain/use-cases/users/get-users.use-case';
import { UpdateUserUseCase } from '../core/domain/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../core/domain/use-cases/users/delete-user.use-case';
import { UserSeed } from '../infrastructure/database/seeds/user.seed';

/**
 * Módulo de Usuários
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    UserService,
    UserSeed,
    {
      provide: 'IUserRepository',
      useClass: MongoUserRepository,
    },
    GetUserByIdUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UserService],
})
export class UsersModule {}
