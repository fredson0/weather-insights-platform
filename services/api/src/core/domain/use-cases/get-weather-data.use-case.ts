import {
  WeatherData,
  WeatherQueryParams,
} from '../entities/weather.entity';
import { IWeatherRepository } from '../repositories/weather.repository.interface';

export interface IGetWeatherDataUseCase {
  execute(params: WeatherQueryParams): Promise<WeatherData[]>;
}

/**
 * Caso de Uso: Obter dados climáticos com filtros
 * Regras de negócio:
 * - Aplicar limites de paginação
 * - Ordenar por timestamp (mais recente primeiro)
 */
export class GetWeatherDataUseCase implements IGetWeatherDataUseCase {
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(params: WeatherQueryParams): Promise<WeatherData[]> {
    const queryParams: WeatherQueryParams = {
      ...params,
      limit: Math.min(params.limit || 100, 500),
      offset: params.offset || 0,
    };

    return await this.weatherRepository.findAll(queryParams);
  }
}

