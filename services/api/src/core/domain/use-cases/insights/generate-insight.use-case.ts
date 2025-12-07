import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GenerateInsightUseCase {
  constructor(
    @InjectModel('Insight') private readonly insightModel: Model<any>,
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async execute(location: string, startDate?: Date, endDate?: Date): Promise<any> {
    // Pegar o último dado climático
    const latestWeather = await this.weatherDataModel
      .findOne()
      .sort({ timestamp: -1 });

    if (!latestWeather) {
      throw new Error('No weather data available');
    }

    // Gerar insight simples (sem IA por enquanto)
    const description = `Temperatura atual: ${latestWeather.temperature}°C. ${
      latestWeather.temperature > 30
        ? 'Temperatura alta, hidrate-se!'
        : latestWeather.temperature < 15
        ? 'Temperatura baixa, agasalhe-se!'
        : 'Temperatura agradável.'
    } Umidade: ${latestWeather.humidity}%. Velocidade do vento: ${latestWeather.windSpeed} km/h.`;

    const insight = new this.insightModel({
      title: `Análise climática - ${latestWeather.location}`,
      description: description,
      type: 'weather_analysis',
      priority: latestWeather.temperature > 30 || latestWeather.temperature < 15 ? 'high' : 'medium',
      aiProvider: 'gemini',
      location: latestWeather.location,
      relatedWeatherDataIds: [latestWeather._id],
      metadata: {
        temperature: latestWeather.temperature,
        humidity: latestWeather.humidity,
        windSpeed: latestWeather.windSpeed,
      },
      generatedAt: new Date(),
    });

    const saved = await insight.save();

    return {
      id: saved._id.toString(),
      title: saved.title,
      content: saved.description,
      type: saved.type,
      createdAt: saved.createdAt,
    };
  }
}
