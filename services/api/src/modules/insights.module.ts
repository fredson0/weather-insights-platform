import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { InsightsController } from '../presentation/controllers';
import { InsightService } from '../application';
import { InsightSchema } from '../infrastructure/database/mongodb/schemas/insight.schema';
import { WeatherDataSchema } from '../infrastructure/database/mongodb/schemas/weather-data.schema';
import { MongoInsightRepository } from '../infrastructure/database/repositories/mongo-insight.repository';
import { MongoWeatherDataRepository } from '../infrastructure/database/repositories/mongo-weather-data.repository';
import { GenerateInsightUseCase } from '../core/domain/use-cases/insights/generate-insight.use-case';
import { GetInsightsUseCase } from '../core/domain/use-cases/insights/get-insights.use-case';
import { AIService } from '../infrastructure/ai/ai.service';

/**
 * Módulo de Insights (IA)
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Insight', schema: InsightSchema },
      { name: 'WeatherData', schema: WeatherDataSchema },
    ]),
    HttpModule,
  ],
  controllers: [InsightsController],
  providers: [
    InsightService,
    {
      provide: 'IInsightRepository',
      useClass: MongoInsightRepository,
    },
    {
      provide: 'IWeatherDataRepository',
      useClass: MongoWeatherDataRepository,
    },
    {
      provide: 'IAIService',
      useClass: AIService,
    },
    GenerateInsightUseCase,
    GetInsightsUseCase,
    AIService,
  ],
  exports: [InsightService],
})
export class InsightsModule {}
