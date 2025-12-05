import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherData } from '../../../core/domain/entities/weather-data.entity';

@Injectable()
export class MongoWeatherDataRepository {
  constructor(
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async save(weatherData: Partial<WeatherData>): Promise<WeatherData> {
    const data = new this.weatherDataModel(weatherData);
    const saved = await data.save();

    return {
      id: saved._id.toString(),
      location: saved.location,
      temperature: saved.temperature,
      humidity: saved.humidity,
      windSpeed: saved.windSpeed,
      precipitation: saved.precipitation,
      condition: saved.condition,
      timestamp: saved.timestamp,
      createdAt: saved.createdAt,
    };
  }

  async findAll(limit: number = 50): Promise<WeatherData[]> {
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

  async findById(id: string): Promise<WeatherData | null> {
    const data = await this.weatherDataModel.findById(id);
    
    if (!data) {
      return null;
    }

    return {
      id: data._id.toString(),
      location: data.location,
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      precipitation: data.precipitation,
      condition: data.condition,
      timestamp: data.timestamp,
      createdAt: data.createdAt,
    };
  }
}
