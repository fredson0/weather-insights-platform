import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherData, CreateWeatherDataDTO, WeatherQueryParams, WeatherStatistics } from '../../../core/domain/entities/weather.entity';
import { IWeatherRepository } from '../../../core/domain/repositories/weather.repository.interface';

@Injectable()
export class MongoWeatherDataRepository implements IWeatherRepository {
  constructor(
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async create(weatherData: CreateWeatherDataDTO): Promise<WeatherData> {
    const data = new this.weatherDataModel({
      ...weatherData,
      timestamp: weatherData.timestamp || new Date(),
    });
    const saved = await data.save();

    return {
      id: saved._id.toString(),
      location: saved.location,
      latitude: saved.latitude,
      longitude: saved.longitude,
      temperature: saved.temperature,
      humidity: saved.humidity,
      windSpeed: saved.windSpeed,
      windDirection: saved.windDirection,
      precipitation: saved.precipitation,
      pressure: saved.pressure,
      cloudCover: saved.cloudCover,
      weatherCode: saved.weatherCode,
      timestamp: saved.timestamp,
      source: saved.source,
      createdAt: saved.createdAt,
    };
  }

  async createMany(weatherDataArray: CreateWeatherDataDTO[]): Promise<WeatherData[]> {
    const saved = await this.weatherDataModel.insertMany(weatherDataArray);
    return saved.map(item => ({
      id: item._id.toString(),
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
      temperature: item.temperature,
      humidity: item.humidity,
      windSpeed: item.windSpeed,
      windDirection: item.windDirection,
      precipitation: item.precipitation,
      pressure: item.pressure,
      cloudCover: item.cloudCover,
      weatherCode: item.weatherCode,
      timestamp: item.timestamp,
      source: item.source,
      createdAt: item.createdAt,
    }));
  }

  async findAll(params: WeatherQueryParams): Promise<WeatherData[]> {
    const query: any = {};
    
    if (params.location) {
      query.location = params.location;
    }
    
    if (params.startDate) {
      query.timestamp = { ...query.timestamp, $gte: params.startDate };
    }
    
    if (params.endDate) {
      query.timestamp = { ...query.timestamp, $lte: params.endDate };
    }

    const data = await this.weatherDataModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(params.limit || 100)
      .skip(params.offset || 0);

    return data.map(item => ({
      id: item._id.toString(),
      location: item.location,
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      temperature: item.temperature,
      humidity: item.humidity,
      windSpeed: item.windSpeed,
      windDirection: item.windDirection || 0,
      precipitation: item.precipitation,
      pressure: item.pressure || 1013,
      cloudCover: item.cloudCover || 0,
      weatherCode: item.weatherCode || 0,
      timestamp: item.timestamp,
      source: item.source || 'unknown',
      createdAt: item.createdAt,
    }));
  }

  async find(params: WeatherQueryParams): Promise<WeatherData[]> {
    return this.findAll(params);
  }

  async findById(id: string): Promise<WeatherData | null> {
    const data = await this.weatherDataModel.findById(id);
    
    if (!data) {
      return null;
    }

    return {
      id: data._id.toString(),
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDirection: data.windDirection,
      precipitation: data.precipitation,
      pressure: data.pressure,
      cloudCover: data.cloudCover,
      weatherCode: data.weatherCode,
      timestamp: data.timestamp,
      source: data.source,
      createdAt: data.createdAt,
    };
  }

  async findLatestByLocation(location: string): Promise<WeatherData | null> {
    const data = await this.weatherDataModel
      .findOne({ location })
      .sort({ timestamp: -1 });
    
    if (!data) {
      return null;
    }

    return {
      id: data._id.toString(),
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDirection: data.windDirection,
      precipitation: data.precipitation,
      pressure: data.pressure,
      cloudCover: data.cloudCover,
      weatherCode: data.weatherCode,
      timestamp: data.timestamp,
      source: data.source,
      createdAt: data.createdAt,
    };
  }

  async getStatistics(location: string, startDate: Date, endDate: Date): Promise<WeatherStatistics | null> {
    const data = await this.weatherDataModel.find({
      location,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    if (data.length === 0) {
      return null;
    }

    const temps = data.map(d => d.temperature);
    const humidities = data.map(d => d.humidity);
    const windSpeeds = data.map(d => d.windSpeed);
    const precipitations = data.map(d => d.precipitation);

    return {
      location,
      avgTemperature: temps.reduce((a, b) => a + b, 0) / temps.length,
      minTemperature: Math.min(...temps),
      maxTemperature: Math.max(...temps),
      avgHumidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
      avgWindSpeed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
      totalPrecipitation: precipitations.reduce((a, b) => a + b, 0),
      dataPoints: data.length,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.weatherDataModel.deleteMany({
      timestamp: { $lt: date }
    });
    return result.deletedCount || 0;
  }

  async count(params?: WeatherQueryParams): Promise<number> {
    const query: any = {};
    
    if (params?.location) {
      query.location = params.location;
    }
    
    if (params?.startDate) {
      query.timestamp = { ...query.timestamp, $gte: params.startDate };
    }
    
    if (params?.endDate) {
      query.timestamp = { ...query.timestamp, $lte: params.endDate };
    }

    return await this.weatherDataModel.countDocuments(query);
  }

  async getLocations(): Promise<string[]> {
    const locations = await this.weatherDataModel.distinct('location');
    return locations;
  }
}
