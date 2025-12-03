import {
  WeatherData,
  CreateWeatherDataDTO,
  WeatherQueryParams,
  WeatherStatistics,
} from '../entities/weather.entity';

/**
 * Interface de repositório para entidade WeatherData
 * Segue o padrão Repository da Clean Architecture
 */
export interface IWeatherRepository {
  /**
   * Criar novo registro de dados climáticos
   */
  create(data: CreateWeatherDataDTO): Promise<WeatherData>;

  /**
   * Criar múltiplos registros de dados climáticos (inserção em lote)
   */
  createMany(data: CreateWeatherDataDTO[]): Promise<WeatherData[]>;

  /**
   * Buscar dados climáticos por ID
   */
  findById(id: string): Promise<WeatherData | null>;

  /**
   * Buscar dados climáticos com filtros
   */
  findAll(params: WeatherQueryParams): Promise<WeatherData[]>;

  /**
   * Buscar dados climáticos mais recentes de uma localização
   */
  findLatestByLocation(location: string): Promise<WeatherData | null>;

  /**
   * Obter estatísticas climáticas para uma localização e período
   */
  getStatistics(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherStatistics | null>;

  /**
   * Deletar dados climáticos antigos (limpeza)
   */
  deleteOlderThan(date: Date): Promise<number>;

  /**
   * Contar registros de dados climáticos
   */
  count(params?: WeatherQueryParams): Promise<number>;

  /**
   * Obter todas as localizações únicas
   */
  getLocations(): Promise<string[]>;
}
