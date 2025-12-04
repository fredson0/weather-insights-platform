import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

/**
 * DTO de criação de dados meteorológicos
 */
export class CreateWeatherDataDTO {
  @IsString({ message: 'Location deve ser uma string' })
  location: string;

  @IsNumber({}, { message: 'Temperature deve ser um número' })
  temperature: number;

  @IsNumber({}, { message: 'Humidity deve ser um número' })
  humidity: number;

  @IsNumber({}, { message: 'Wind speed deve ser um número' })
  windSpeed: number;

  @IsNumber({}, { message: 'Precipitation deve ser um número' })
  precipitation: number;

  @IsOptional()
  @IsString({ message: 'Condition deve ser uma string' })
  condition?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Timestamp deve ser uma data ISO válida' })
  timestamp?: string;
}
