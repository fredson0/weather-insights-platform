import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeatherDataUseCase } from '../../core/domain/use-cases/create-weather-data.use-case';
import { GetWeatherDataUseCase } from '../../core/domain/use-cases/get-weather-data.use-case';
import { GetWeatherStatisticsUseCase } from '../../core/domain/use-cases/get-weather-statistics.use-case';
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
    private readonly createWeatherDataUseCase: CreateWeatherDataUseCase,
    private readonly getWeatherDataUseCase: GetWeatherDataUseCase,
    private readonly getWeatherStatisticsUseCase: GetWeatherStatisticsUseCase,
    private readonly weatherRepository: IWeatherRepository,
    private readonly exportService: IExportService,
    private readonly externalAPIClient: IExternalAPIClient,
  ) {}

  /**
   * Cria novo registro de dados climáticos
   */
  async create(data: CreateWeatherDataDTO): Promise<WeatherData> {
    return await this.createWeatherDataUseCase.execute(data);
  }

  /**
   * Busca dados climáticos atuais da API externa
   */
  async fetchCurrentWeather(latitude?: number, longitude?: number): Promise<WeatherData> {
    const weatherData = await this.externalAPIClient.getCurrentWeather(latitude, longitude);
    return await this.createWeatherDataUseCase.execute(weatherData);
  }

  /**
   * Busca dados climáticos com filtros
   */
  async findAll(params: WeatherQueryParams): Promise<WeatherData[]> {
    return await this.getWeatherDataUseCase.execute(params);
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
    return await this.getWeatherStatisticsUseCase.execute({ location, startDate, endDate });
  }

  /**
   * Exporta dados climáticos para CSV
   */
  async exportToCSV(params: WeatherQueryParams): Promise<Buffer> {
    const data = await this.getWeatherDataUseCase.execute(params);
    return await this.exportService.exportToCSV(data);
  }

  /**
   * Exporta dados climáticos para XLSX
   */
  async exportToXLSX(params: WeatherQueryParams): Promise<Buffer> {
    const data = await this.getWeatherDataUseCase.execute(params);
    return await this.exportService.exportToXLSX(data);
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
