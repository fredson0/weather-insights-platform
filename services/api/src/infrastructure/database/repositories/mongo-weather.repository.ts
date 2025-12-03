import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WeatherData,
  CreateWeatherDataDTO,
  WeatherQueryParams,
  WeatherStatistics,
} from '../../../../core/domain/entities/weather.entity';
import { IWeatherRepository } from '../../../../core/domain/repositories/weather.repository.interface';
import { WeatherDocument } from '../mongodb/schemas/weather.schema';

/**
 * Implementação do Repository de WeatherData usando MongoDB
 * 
 * RESPONSABILIDADE: Executar operações no banco de dados MongoDB
 */
@Injectable()
export class MongoWeatherRepository implements IWeatherRepository {
  constructor(
    @InjectModel('WeatherData')
    private readonly weatherModel: Model<WeatherDocument>,
  ) {}

  /**
   * Criar novo registro de dados climáticos
   */
  async create(data: CreateWeatherDataDTO): Promise<WeatherData> {
  const weather = new this.weatherModel(data);
  const saved = await weather.save();

    return saved.toObject() as WeatherData;
  }

  /**
   * Criar múltiplos registros (bulk insert)
   */
  async createMany(data: CreateWeatherDataDTO[]): Promise<WeatherData[]> {
    const savedDocs = await this.weatherModel.insertMany(data);
    return savedDocs.map((doc) => doc.toObject() as WeatherData);
  }

  /**
   * Buscar dados climáticos por ID
   */
  async findById(id: string): Promise<WeatherData | null> {
   const weather = await this.weatherModel.findById(id).exec();
   return weather ? (weather. toObject() as WeatherData) : null;
   
  }

  /**
   * Buscar dados climáticos com filtros
   */
  async findAll(params: WeatherQueryParams): Promise<WeatherData[]> {

    const query = this.weatherModel.find();

    if (params.location){
        query.where('location').equals(params.location);
    }
    if (params.startDate && params.endDate){
        query.where('timestamp').gte(params.startDate).lte(params.endDate);
    }

    query.sort({ timestamp: -1});

    if (params.offset){
        query.skip(params.offset);
    }

    if (params.limit){
        query.limit(params.limit);
    }
    const weatherData = await query.exec();
    return weatherData.map((data) => data.toObject() as WeatherData);
  }

  /**
   * Buscar dados mais recentes de uma localização
   */
  async findLatestByLocation(location: string): Promise<WeatherData | null> {

    const weather = await this.weatherModel
        .findOne({ location })
        .sort({ timestamp: -1 }) // Mais recente
        .exec();
    return weather ? (weather.toObject() as WeatherData) : null;
  }

  /**
   * Obter estatísticas climáticas para período
   */
  async getStatistics(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherStatistics | null> {
    const stats = await this.weatherModel.aggregate([
    {
      $match: {
        location,
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$location',
        avgTemperature: { $avg: '$temperature' },
        minTemperature: { $min: '$temperature' },
        maxTemperature: { $max: '$temperature' },
        avgHumidity: { $avg: '$humidity' },
        avgWindSpeed: { $avg: '$windSpeed' },
        totalPrecipitation: { $sum: '$precipitation' },
        dataPoints: { $sum: 1 }
      }
    }
  ]);

  if (!stats || stats.length === 0) {
    return null;
  }

  const result = stats[0];
  return {
    location,
    period: {
      start: startDate,
      end: endDate
    },
    avgTemperature: result.avgTemperature,
    minTemperature: result.minTemperature,
    maxTemperature: result.maxTemperature,
    avgHumidity: result.avgHumidity,
    avgWindSpeed: result.avgWindSpeed,
    totalPrecipitation: result.totalPrecipitation,
    dataPoints: result.dataPoints
  };

  }

  /**
   * Deletar dados antigos (cleanup)
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.weatherModel.deleteMany({
        timestamp: {$lt: date}
    }).exec();
    return result.deletedCount;
  }

  /**
   * Contar registros
   */
  async count(params?: WeatherQueryParams): Promise<number> {
    const query: any = {};

  if (params?.location) {
    query.location = params.location;
  }

  if (params?.startDate && params?.endDate) {
    query.timestamp = {
      $gte: params.startDate,
      $lte: params.endDate
    };
  }

  return await this.weatherModel.countDocuments(query);
  
  }

  /**
   * Obter todas as localizações únicas
   */
  async getLocations(): Promise<string[]> {
    return await this.weatherModel.distinct('location').exec();
  }
}
