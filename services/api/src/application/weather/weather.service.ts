import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  WeatherData,
  CreateWeatherDataDTO,
  WeatherQueryParams,
  WeatherStatistics,
} from '../../core/domain/entities/weather.entity';
import { IWeatherRepository } from '../../core/domain/repositories/weather.repository.interface';
import { IExportService } from '../../core/ports/export.port';
import { IExternalAPIClient } from '../../core/ports/external-api.port';

/**
 * Serviço de dados climáticos
 * 
 * RESPONSABILIDADE: Orquestrar operações de dados climáticos e exportação
 */
@Injectable()
export class WeatherService {
  constructor(
    @Inject('IWeatherDataRepository')
    private readonly weatherRepository: IWeatherRepository,
    @Inject('IExportService')
    private readonly exportService: IExportService,
    @Inject('IExternalAPIClient')
    private readonly externalAPIClient: IExternalAPIClient,
  ) {}

  /**
   * Cria novo registro de dados climáticos
   */
  async create(data: CreateWeatherDataDTO): Promise<WeatherData> {
    return await this.weatherRepository.create(data);
  }

  /**
   * Busca dados climáticos atuais da API externa
   */
  async fetchCurrentWeather(latitude?: number, longitude?: number): Promise<WeatherData> {
    const params = {
      latitude: latitude || -12.9714,
      longitude: longitude || -38.5014,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl,cloud_cover,weather_code',
      timezone: 'America/Sao_Paulo',
    };
    
    const response = await this.externalAPIClient.fetch<any>('', { params });
    
    const weatherData: CreateWeatherDataDTO = {
      location: 'Salvador',
      latitude: params.latitude,
      longitude: params.longitude,
      temperature: response.current.temperature_2m || 0,
      humidity: response.current.relative_humidity_2m || 0,
      windSpeed: response.current.wind_speed_10m || 0,
      windDirection: response.current.wind_direction_10m || 0,
      precipitation: response.current.precipitation || 0,
      pressure: response.current.pressure_msl || 1013,
      cloudCover: response.current.cloud_cover || 0,
      weatherCode: response.current.weather_code || 0,
      source: 'open-meteo',
    };
    
    return await this.weatherRepository.create(weatherData);
  }

  /**
   * Busca dados climáticos com filtros
   */
  async findAll(params: WeatherQueryParams): Promise<WeatherData[]> {
    return await this.weatherRepository.findAll(params);
  }

  /**
   * Busca dados mais recentes de uma localização
   */
  async findLatestByLocation(location: string): Promise<WeatherData | null> {
    return await this.weatherRepository.findLatestByLocation(location);
  }

  /**
   * Obtém estatísticas climáticas de um período
   */
  async getStatistics(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherStatistics | null> {
    return await this.weatherRepository.getStatistics(location, startDate, endDate);
  }

  /**
   * Exporta dados climáticos para CSV
   */
  async exportToCSV(params: WeatherQueryParams): Promise<Buffer> {
    const data = await this.weatherRepository.findAll(params);
    return await this.exportService.exportToCSV(data, 'weather-data.csv');
  }

  /**
   * Exporta dados climáticos para XLSX
   */
  async exportToXLSX(params: WeatherQueryParams): Promise<Buffer> {
    const data = await this.weatherRepository.findAll(params);
    return await this.exportService.exportToExcel(data, 'weather-data.xlsx');
  }

  /**
   * Obtém todas as localizações únicas
   */
  async getLocations(): Promise<string[]> {
    return await this.weatherRepository.getLocations();
  }

  /**
   * Conta registros climáticos
   */
  async count(params?: WeatherQueryParams): Promise<number> {
    return await this.weatherRepository.count(params);
  }
}
