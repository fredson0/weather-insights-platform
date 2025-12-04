import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de query params para busca de insights
 */
export class GetInsightsParamsDTO {
  @IsOptional()
  @IsString({ message: 'Location deve ser uma string' })
  location?: string;

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
