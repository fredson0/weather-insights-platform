import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherData } from '../../entities/weather-data.entity';

export class CreateWeatherDataDto {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  timestamp: Date;
}

@Injectable()
export class CreateWeatherDataUseCase {
  constructor(
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async execute(dto: CreateWeatherDataDto): Promise<WeatherData> {
    const weatherData = new this.weatherDataModel({
      ...dto,
      timestamp: dto.timestamp || new Date(),
    });

    const saved = await weatherData.save();

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
}
