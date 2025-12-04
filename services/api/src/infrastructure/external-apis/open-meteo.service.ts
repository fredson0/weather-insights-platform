import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateWeatherDataDTO } from '../../core/domain/entities/weather.entity';
import { IExternalAPIClient } from '../../core/ports/external-api.port';

/**
 * Serviço de integração com API Open-Meteo
 * 
 * RESPONSABILIDADE: Buscar dados climáticos de Salvador, BA
 */
@Injectable()
export class OpenMeteoService implements IExternalAPIClient {
  private readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Busca dados climáticos atuais para uma localização
   */
  async getCurrentWeather(
    latitude?: number,
    longitude?: number,
  ): Promise<CreateWeatherDataDTO> {
    try {
      // Obter coordenadas do .env se não fornecidas
      const lat = latitude || this.configService.get<number>('WEATHER_LATITUDE');
      const lon = longitude || this.configService.get<number>('WEATHER_LONGITUDE');

      // Montar parâmetros da requisição
      const params = {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
        timezone: 'America/Sao_Paulo',
      };

      // Fazer requisição HTTP para Open-Meteo
      const response = await firstValueFrom(
        this.httpService.get(this.BASE_URL, { params }),
      );

      const data = response.data;
      const current = data.current;

      // Obter nome da localização
      const locationName =
        this.configService.get<string>('WEATHER_LOCATION_NAME') ||
        `${lat},${lon}`;

      // Retornar dados formatados
      return {
        location: locationName,
        timestamp: new Date(current.time),
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar dados climáticos da API Open-Meteo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
