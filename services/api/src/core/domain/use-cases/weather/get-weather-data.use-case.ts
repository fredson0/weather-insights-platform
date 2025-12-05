import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherData } from '../../entities/weather-data.entity';

@Injectable()
export class GetWeatherDataUseCase {
  constructor(
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async execute(limit: number = 50): Promise<WeatherData[]> {
    const data = await this.weatherDataModel
      .find()
      .sort({ timestamp: -1 })
      .limit(limit);

    return data.map(item => ({
      id: item._id.toString(),
      location: item.location,
      temperature: item.temperature,
      humidity: item.humidity,
      windSpeed: item.windSpeed,
      precipitation: item.precipitation,
      condition: item.condition,
      timestamp: item.timestamp,
      createdAt: item.createdAt,
    }));
  }
}
