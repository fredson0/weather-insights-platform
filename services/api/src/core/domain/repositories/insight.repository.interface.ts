import {
  Insight,
  CreateInsightDTO,
  InsightQueryParams,
} from '../entities/insight.entity';

/**
 * Interface de repositório para entidade Insight
 * Segue o padrão Repository da Clean Architecture
 */
export interface IInsightRepository {
  /**
   * Criar um novo insight
   */
  create(data: CreateInsightDTO): Promise<Insight>;

  /**
   * Buscar insight por ID
   */
  findById(id: string): Promise<Insight | null>;

  /**
   * Buscar insights com filtros
   */
  findAll(params: InsightQueryParams): Promise<Insight[]>;

  /**
   * Buscar insights mais recentes de uma localização
   */
  findLatestByLocation(location: string, limit?: number): Promise<Insight[]>;

  /**
   * Deletar insight por ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Deletar insights antigos (limpeza)
   */
  deleteOlderThan(date: Date): Promise<number>;

  /**
   * Contar insights
   */
  count(params?: InsightQueryParams): Promise<number>;
}
