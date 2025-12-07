import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { WeatherService } from '../../application';
import { JwtAuthGuard } from '../guards';
import { CreateWeatherDataDTO, GetWeatherDataParamsDTO } from '../dtos/weather';

/**
 * Controller de dados meteorológicos
 */
@ApiTags('3. Dados Climáticos')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWeatherDataDTO) {
    return this.weatherService.create(dto);
  }

  @Post('fetch-current')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async fetchCurrent(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
  ) {
    return this.weatherService.fetchCurrentWeather(latitude, longitude);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar dados climáticos',
    description: 'Retorna histórico de dados meteorológicos coletados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de registros climáticos',
    schema: {
      example: [
        {
          id: '507f1f77bcf86cd799439011',
          location: 'Salvador, BA',
          latitude: -12.9714,
          longitude: -38.5014,
          temperature: 28.1,
          humidity: 68,
          windSpeed: 12.3,
          windDirection: 97,
          precipitation: 0.0,
          pressure: 1012.4,
          cloudCover: 100,
          weatherCode: 3,
          timestamp: '2025-12-06T18:00:00.000Z'
        }
      ]
    }
  })
  async findAll(@Query() params: GetWeatherDataParamsDTO) {
    const queryParams = {
      location: params.location,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      limit: params.limit,
      offset: params.page ? (params.page - 1) * (params.limit || 50) : 0,
    };
    return this.weatherService.findAll(queryParams);
  }

  @Get('locations')
  @UseGuards(JwtAuthGuard)
  async getLocations() {
    return this.weatherService.getLocations();
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  async getStatistics(
    @Query('location') location: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.weatherService.getStatistics(location, start, end);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Exportar dados em CSV',
    description: 'Baixa arquivo CSV com histórico de dados climáticos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Arquivo CSV gerado com sucesso'
  })
  async exportCSV(@Query() params: GetWeatherDataParamsDTO, @Res() res: Response) {
    const queryParams = {
      location: params.location,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      limit: params.limit,
      offset: params.page ? (params.page - 1) * (params.limit || 50) : 0,
    };
    const csvBuffer = await this.weatherService.exportToCSV(queryParams);

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="weather-data-${Date.now()}.csv"`,
    });

    res.send(csvBuffer);
  }

  @Get('export/xlsx')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Exportar dados em Excel',
    description: 'Baixa arquivo XLSX com histórico de dados climáticos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Arquivo Excel gerado com sucesso'
  })
  async exportXLSX(@Query() params: GetWeatherDataParamsDTO, @Res() res: Response) {
    const queryParams = {
      location: params.location,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      limit: params.limit,
      offset: params.page ? (params.page - 1) * (params.limit || 50) : 0,
    };
    const xlsxBuffer = await this.weatherService.exportToXLSX(queryParams);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="weather-data-${Date.now()}.xlsx"`,
    });

    res.send(xlsxBuffer);
  }
}
