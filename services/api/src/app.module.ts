import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { WeatherModule } from './modules/weather.module';
import { InsightsModule } from './modules/insights.module';
import { JwtStrategy } from './config/jwt.strategy';

/**
 * Módulo raiz da aplicação
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: require('./infrastructure/database/mongodb/schemas/user.schema').UserSchema }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    WeatherModule,
    InsightsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
