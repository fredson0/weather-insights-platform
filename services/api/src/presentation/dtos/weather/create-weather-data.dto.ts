import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de criação de dados meteorológicos
 */
export class CreateWeatherDataDTO {
  @IsString({ message: 'Location deve ser uma string' })
  location: string;

  @IsNumber({}, { message: 'Latitude deve ser um número' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude deve ser um número' })
  longitude: number;

  @IsNumber({}, { message: 'Temperature deve ser um número' })
  temperature: number;

  @IsNumber({}, { message: 'Humidity deve ser um número' })
  humidity: number;

  @IsNumber({}, { message: 'Wind speed deve ser um número' })
  windSpeed: number;

  @IsNumber({}, { message: 'Wind direction deve ser um número' })
  windDirection: number;

  @IsNumber({}, { message: 'Precipitation deve ser um número' })
  precipitation: number;

  @IsNumber({}, { message: 'Pressure deve ser um número' })
  pressure: number;

  @IsNumber({}, { message: 'Cloud cover deve ser um número' })
  cloudCover: number;

  @IsNumber({}, { message: 'Weather code deve ser um número' })
  weatherCode: number;

  @IsOptional()
  @IsString({ message: 'Source deve ser uma string' })
  source?: string = 'api';

  @IsOptional()
  @Type(() => Date)
  timestamp?: Date;
}
