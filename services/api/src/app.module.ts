import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// TODO: Importar módulos da aplicação aqui
// import { AuthModule } from './application/auth/auth.module';
// import { UsersModule } from './application/users/users.module';
// import { WeatherModule } from './application/weather/weather.module';
// import { InsightsModule } from './application/insights/insights.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexão com MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/gdash-weather'),

    // Módulos da aplicação (descomente conforme implementar)
    // AuthModule,
    // UsersModule,
    // WeatherModule,
    // InsightsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
