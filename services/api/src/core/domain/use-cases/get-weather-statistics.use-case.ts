import { WeatherStatistics } from '../entities/weather.entity';
import { IWeatherRepository } from '../repositories/weather.repository.interface';

export interface IGetWeatherStatisticsUseCase {
  execute(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherStatistics | null>;
}

/**
 * Caso de Uso: Obter estatísticas climáticas para uma localização e período
 * Regras de negócio:
 * - Range de datas deve ser válido
 * - Máximo de 90 dias de intervalo
 */
export class GetWeatherStatisticsUseCase
  implements IGetWeatherStatisticsUseCase
{
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherStatistics | null> {

    if (startDate >= endDate) {
        throw new Error("Data de início deve ser anterior à data de fim.");
    }
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > 90) {
        throw new Error("O intervalo máximo permitido é de 90 dias.");
    }

    return await this.weatherRepository.getStatistics(
        location.trim().toLowerCase(),
        startDate,
        endDate
    );
    
  }
}
