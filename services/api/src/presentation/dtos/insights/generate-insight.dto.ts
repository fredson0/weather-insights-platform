import { IsString, IsDateString, IsOptional } from 'class-validator';

/**
 * DTO de geração de insights
 */
export class GenerateInsightDTO {
  @IsString({ message: 'Location deve ser uma string' })
  location: string;

  @IsOptional()
  @IsDateString({}, { message: 'startDate deve ser uma data ISO válida' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate deve ser uma data ISO válida' })
  endDate?: string;
}
