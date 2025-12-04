import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de query params para busca de dados meteorológicos
 */
export class GetWeatherDataParamsDTO {
  @IsOptional()
  @IsString({ message: 'Location deve ser uma string' })
  location?: string;

  @IsOptional()
  @IsDateString({}, { message: 'startDate deve ser uma data ISO válida' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate deve ser uma data ISO válida' })
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page deve ser um número' })
  @Min(1, { message: 'page deve ser no mínimo 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'limit deve ser um número' })
  @Min(1, { message: 'limit deve ser no mínimo 1' })
  limit?: number;
}
