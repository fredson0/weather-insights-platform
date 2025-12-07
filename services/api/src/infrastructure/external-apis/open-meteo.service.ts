import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateWeatherDataDTO } from '../../core/domain/entities/weather.entity';
import { IExternalAPIClient, RequestOptions } from '../../core/ports/external-api.port';

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

  async fetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}${endpoint}`, {
          params: options?.params,
          headers: options?.headers,
          timeout: options?.timeout || 5000,
        }),
      );
      return response.data as T;
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar dados da API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.BASE_URL}${endpoint}`, data, {
          params: options?.params,
          headers: options?.headers,
          timeout: options?.timeout || 5000,
        }),
      );
      return response.data as T;
    } catch (error) {
      throw new HttpException(
        `Erro ao enviar dados para API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca dados climáticos atuais para uma localização
   */
  async getCurrentWeather(
    latitude?: number,
    longitude?: number,
  ): Promise<CreateWeatherDataDTO> {
    try {
      const lat = latitude || this.configService.get<number>('WEATHER_LATITUDE', -12.9714);
      const lon = longitude || this.configService.get<number>('WEATHER_LONGITUDE', -38.5014);

      const params = {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl,cloud_cover,weather_code',
        timezone: 'America/Sao_Paulo',
      };

      const response = await firstValueFrom(
        this.httpService.get(this.BASE_URL, { params }),
      );

      const data = response.data;
      const current = data.current;

      const locationName =
        this.configService.get<string>('WEATHER_LOCATION_NAME') || 'Salvador';

      return {
        location: locationName,
        latitude: lat,
        longitude: lon,
        timestamp: new Date(current.time),
        temperature: current.temperature_2m || 0,
        humidity: current.relative_humidity_2m || 0,
        windSpeed: current.wind_speed_10m || 0,
        windDirection: current.wind_direction_10m || 0,
        precipitation: current.precipitation || 0,
        pressure: current.pressure_msl || 1013,
        cloudCover: current.cloud_cover || 0,
        weatherCode: current.weather_code || 0,
        source: 'open-meteo',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar dados climáticos da API Open-Meteo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
