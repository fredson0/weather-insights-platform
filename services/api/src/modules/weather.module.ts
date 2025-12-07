import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { WeatherController } from '../presentation/controllers';
import { WeatherService } from '../application';
import { WeatherDataSchema } from '../infrastructure/database/mongodb/schemas/weather-data.schema';
import { MongoWeatherDataRepository } from '../infrastructure/database/repositories/mongo-weather-data.repository';
import { OpenMeteoService } from '../infrastructure/external-apis/open-meteo.service';
import { RabbitMQService } from '../infrastructure/queue/rabbitmq.service';
import { ExportService } from '../infrastructure/export/export.service';

/**
 * Módulo de Dados Meteorológicos
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WeatherData', schema: WeatherDataSchema },
    ]),
    HttpModule,
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: 'IWeatherDataRepository',
      useClass: MongoWeatherDataRepository,
    },
    {
      provide: 'IExternalAPIClient',
      useClass: OpenMeteoService,
    },
    {
      provide: 'IMessageQueueClient',
      useClass: RabbitMQService,
    },
    {
      provide: 'IExportService',
      useClass: ExportService,
    },
    OpenMeteoService,
    RabbitMQService,
    ExportService,
  ],
  exports: [WeatherService, RabbitMQService],
})
export class WeatherModule {}
