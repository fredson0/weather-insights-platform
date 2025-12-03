import { Insight, InsightQueryParams } from '../entities/insight.entity';
import { IInsightRepository } from '../repositories/insight.repository.interface';

export interface IGetInsightsUseCase {
  execute(params: InsightQueryParams): Promise<Insight[]>;
}

/**
 * Caso de Uso: Obter insights com filtros
 * Regras de negócio:
 * - Aplicar limites de paginação
 * - Ordenar por prioridade e data de geração
 */
export class GetInsightsUseCase implements IGetInsightsUseCase {
  constructor(private readonly insightRepository: IInsightRepository) {}

  async execute(params: InsightQueryParams): Promise<Insight[]> {
    const queryParams: InsightQueryParams = {
        ...params,
        limit: Math.min(params.limit || 50, 200),
        offset: params.offset || 0,
    };

    const insights = await this.insightRepository.findAll(queryParams);

    return insights;
  }
}
