import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Insight,
  CreateInsightDTO,
  InsightQueryParams,
} from '../../../../core/domain/entities/insight.entity';
import { IInsightRepository } from '../../../../core/domain/repositories/insight.repository.interface';
import { InsightDocument } from '../mongodb/schemas/insight.schema';

/**
 * Implementação do Repository de Insight usando MongoDB
 * 
 * RESPONSABILIDADE: Executar operações no banco de dados MongoDB
 */
@Injectable()
export class MongoInsightRepository implements IInsightRepository {
  constructor(
    @InjectModel('Insight')
    private readonly insightModel: Model<InsightDocument>,
  ) {}

  /**
   * Criar um novo insight
   */
  async create(data: CreateInsightDTO): Promise<Insight> {
    const insight = new this.insightModel(data);
    const saved = await insight.save();
    return saved.toObject() as Insight;
  }

  /**
   * Buscar insight por ID
   */
  async findById(id: string): Promise<Insight | null> {
    const insight = await this.insightModel.findById(id).exec();
    return insight ? (insight.toObject() as Insight) : null;
  }

  /**
   * Buscar insights com filtros
   */
  async findAll(params: InsightQueryParams): Promise<Insight[]> {
    const query = this.insightModel.find();

    if (params.type) {
      query.where('type').equals(params.type);
    }

    if (params.priority) {
      query.where('priority').equals(params.priority);
    }

    if (params.location) {
      query.where('location').equals(params.location);
    }

    if (params.startDate && params.endDate) {
      query.where('generatedAt').gte(params.startDate).lte(params.endDate);
    }

    // Ordenar por prioridade (desc) e data de geração (desc)
    query.sort({ priority: -1, generatedAt: -1 });

    if (params.offset) {
      query.skip(params.offset);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    const insights = await query.exec();
    return insights.map((insight) => insight.toObject() as Insight);
  }

  /**
   * Buscar insights mais recentes de uma localização
   */
  async findLatestByLocation(
    location: string,
    limit: number = 10,
  ): Promise<Insight[]> {
    const insights = await this.insightModel
      .find({ location })
      .sort({ generatedAt: -1 })
      .limit(limit)
      .exec();

    return insights.map((insight) => insight.toObject() as Insight);
  }

  /**
   * Deletar insight por ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.insightModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Deletar insights antigos
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.insightModel.deleteMany({
      generatedAt: { $lt: date }
    }).exec();
    return result.deletedCount;
  }

  /**
   * Contar insights
   */
  async count(params?: InsightQueryParams): Promise<number> {
    const query: any = {};

    if (params?.type) {
      query.type = params.type;
    }

    if (params?.priority) {
      query.priority = params.priority;
    }

    if (params?.location) {
      query.location = params.location;
    }

    if (params?.startDate && params?.endDate) {
      query.generatedAt = {
        $gte: params.startDate,
        $lte: params.endDate
      };
    }

    return await this.insightModel.countDocuments(query);
  }
}
