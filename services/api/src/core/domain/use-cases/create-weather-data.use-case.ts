import { WeatherData, CreateWeatherDataDTO } from '../entities/weather.entity';
import { IWeatherRepository } from '../repositories/weather.repository.interface';

export interface ICreateWeatherDataUseCase {
  execute(data: CreateWeatherDataDTO): Promise<WeatherData>;
}

/**
 * Caso de Uso: Criar registro de dados climáticos
 * Regras de negócio:
 * - Validar que coordenadas são válidas
 * - Definir timestamp se não fornecido
 * - Normalizar nome da localização
 */
export class CreateWeatherDataUseCase implements ICreateWeatherDataUseCase {
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(data: CreateWeatherDataDTO): Promise<WeatherData> {

    if (!data.latitude < -90 || data.latitude > 90) {
        throw new Error('Latitude inválida, deve estar entre -90 e 90.');
    }
    if (!data.longitude < -180 || data.longitude > 180) {
        throw new Error('Longitude inválida, deve estar entre -180 e 180.');
    }

    const weatherData: createWeatherDataDTO = {
        ...data,
        location: data.location.trim().toLowerCase(),
        timestamp: data.timestamp || new Date(),
    };

    return await this.weatherRepository.create(weatherData);
  }
}
