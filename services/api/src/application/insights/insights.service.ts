import { Injectable, Inject } from '@nestjs/common';
import { GenerateInsightUseCase } from '../../core/domain/use-cases/insights/generate-insight.use-case';
import { GetInsightsUseCase } from '../../core/domain/use-cases/insights/get-insights.use-case';
import { Insight, InsightQueryParams } from '../../core/domain/entities/insight.entity';
import { IInsightRepository } from '../../core/domain/repositories/insight.repository.interface';

/**
 * Serviço de insights climáticos
 * 
 * RESPONSABILIDADE: Orquestrar geração e consulta de insights com IA
 */
@Injectable()
export class InsightService {
  constructor(
    private readonly generateInsightUseCase: GenerateInsightUseCase,
    private readonly getInsightsUseCase: GetInsightsUseCase,
    @Inject('IInsightRepository')
    private readonly insightRepository: IInsightRepository,
  ) {}

  /**
   * Gera novo insight para uma localização
   */
  async generate(location: string, startDate: Date, endDate: Date): Promise<Insight> {
    return await this.generateInsightUseCase.execute(location, startDate, endDate);
  }

  /**
   * Busca insights com filtros
   */
  async findAll(params: InsightQueryParams): Promise<Insight[]> {
    return await this.getInsightsUseCase.execute(params);
  }

  /**
   * Busca insights mais recentes de uma localização
   */
  async findLatestByLocation(location: string, limit: number = 10): Promise<Insight[]> {
    return await this.insightRepository.findLatestByLocation(location, limit);
  }

  /**
   * Busca insight por ID
   */
  async findById(id: string): Promise<Insight | null> {
    return await this.insightRepository.findById(id);
  }

  /**
   * Deleta insight
   */
  async delete(id: string): Promise<boolean> {
    return await this.insightRepository.delete(id);
  }

  /**
   * Conta insights
   */
  async count(params?: InsightQueryParams): Promise<number> {
    return await this.insightRepository.count(params);
  }
}
