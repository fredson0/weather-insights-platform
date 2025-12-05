import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface WeatherStatistics {
  avgTemperature: number;
  avgHumidity: number;
  avgWindSpeed: number;
  totalRecords: number;
}

@Injectable()
export class GetWeatherStatisticsUseCase {
  constructor(
    @InjectModel('WeatherData') private readonly weatherDataModel: Model<any>,
  ) {}

  async execute(): Promise<WeatherStatistics> {
    const stats = await this.weatherDataModel.aggregate([
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          avgWindSpeed: { $avg: '$windSpeed' },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        avgTemperature: 0,
        avgHumidity: 0,
        avgWindSpeed: 0,
        totalRecords: 0,
      };
    }

    return {
      avgTemperature: Math.round(stats[0].avgTemperature * 10) / 10,
      avgHumidity: Math.round(stats[0].avgHumidity),
      avgWindSpeed: Math.round(stats[0].avgWindSpeed * 10) / 10,
      totalRecords: stats[0].totalRecords,
    };
  }
}
