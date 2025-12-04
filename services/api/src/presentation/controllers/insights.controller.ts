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
import { InsightService } from '../../application';
import { JwtAuthGuard } from '../guards';
import { GenerateInsightDTO, GetInsightsParamsDTO } from '../dtos/insights';

/**
 * Controller de insights (IA com Google Gemini)
 */
@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightService: InsightService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generate(@Body() dto: GenerateInsightDTO) {
    return this.insightService.generate(
      dto.location,
      dto.startDate,
      dto.endDate,
    );
  }

  @Get()
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
