import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InsightService } from '../../application';
import { JwtAuthGuard } from '../guards';
import { GenerateInsightDTO, GetInsightsParamsDTO } from '../dtos/insights';

/**
 * Controller de insights (IA com Google Gemini)
 */
@ApiTags('4. Insights de IA')
@ApiBearerAuth('JWT-auth')
@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightService: InsightService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Gerar novo insight de IA',
    description: 'Analisa dados climáticos e gera insights automáticos'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Insight gerado com sucesso',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439011',
        title: 'Análise climática - Salvador, BA',
        description: 'Temperatura atual: 28.1°C. Temperatura agradável. Umidade: 68%. Velocidade do vento: 12.6 km/h.',
        type: 'weather_analysis',
        priority: 'medium',
        location: 'salvador, ba',
        createdAt: '2025-12-06T18:30:00.000Z'
      }
    }
  })
  async generate(@Body() dto: GenerateInsightDTO) {
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = dto.endDate ? new Date(dto.endDate) : new Date();
    
    return this.insightService.generate(
      dto.location,
      startDate,
      endDate,
    );
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar insights',
    description: 'Retorna lista de insights gerados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de insights',
    schema: {
      example: [
        {
          id: '507f1f77bcf86cd799439011',
          title: 'Análise climática - Salvador, BA',
          description: 'Temperatura atual: 28.1°C. Temperatura agradável.',
          type: 'weather_analysis',
          priority: 'medium',
          createdAt: '2025-12-06T18:30:00.000Z'
        }
      ]
    }
  })
  async findAll(@Query() params: GetInsightsParamsDTO) {
    return this.insightService.findAll(params);
  }

  @Get('latest/:location')
  async findLatest(
    @Param('location') location: string,
    @Query('limit') limit?: number,
  ) {
    return this.insightService.findLatestByLocation(location, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.insightService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.insightService.delete(id);
  }
}
