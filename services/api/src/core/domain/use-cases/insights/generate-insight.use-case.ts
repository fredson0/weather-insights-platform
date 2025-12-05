import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GenerateInsightUseCase {
  constructor(
    @InjectModel('Insight') private readonly insightModel: Model<any>,
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async execute(): Promise<any> {
    // Pegar o último dado climático
    const latestWeather = await this.weatherDataModel
      .findOne()
      .sort({ timestamp: -1 });

    if (!latestWeather) {
      throw new Error('No weather data available');
    }

    // Gerar insight simples (sem IA por enquanto)
    const insight = new this.insightModel({
      title: `Análise climática - ${latestWeather.location}`,
      content: `Temperatura atual: ${latestWeather.temperature}°C. ${
        latestWeather.temperature > 30
          ? 'Temperatura alta, hidrate-se!'
          : latestWeather.temperature < 15
          ? 'Temperatura baixa, agasalhe-se!'
          : 'Temperatura agradável.'
      }`,
      type: 'analysis',
      weatherDataId: latestWeather._id.toString(),
    });

    const saved = await insight.save();

    return {
      id: saved._id.toString(),
      title: saved.title,
      content: saved.content,
      type: saved.type,
      weatherDataId: saved.weatherDataId,
      createdAt: saved.createdAt,
    };
  }
}
