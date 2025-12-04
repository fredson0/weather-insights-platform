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
import { Response } from 'express';
import { WeatherService } from '../../application';
import { JwtAuthGuard } from '../guards';
import { CreateWeatherDataDTO, GetWeatherDataParamsDTO } from '../dtos/weather';

/**
 * Controller de dados meteorológicos
 */
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
  async findAll(@Query() params: GetWeatherDataParamsDTO) {
    return this.weatherService.findAll(params);
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
    return this.weatherService.getStatistics(location, startDate, endDate);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  async exportCSV(@Query() params: GetWeatherDataParamsDTO, @Res() res: Response) {
    const csvBuffer = await this.weatherService.exportToCSV(params);

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="weather-data-${Date.now()}.csv"`,
    });

    res.send(csvBuffer);
  }

  @Get('export/xlsx')
  @UseGuards(JwtAuthGuard)
  async exportXLSX(@Query() params: GetWeatherDataParamsDTO, @Res() res: Response) {
    const xlsxBuffer = await this.weatherService.exportToXLSX(params);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="weather-data-${Date.now()}.xlsx"`,
    });

    res.send(xlsxBuffer);
  }
}
