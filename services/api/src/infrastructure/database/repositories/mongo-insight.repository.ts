import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Insight,
  CreateInsightDTO,
  InsightQueryParams,
} from '../../../core/domain/entities/insight.entity';
import { IInsightRepository } from '../../../core/domain/repositories/insight.repository.interface';
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

  private mapToEntity(doc: any): Insight {
    return {
      id: doc._id?.toString() || doc.id,
      type: doc.type,
      priority: doc.priority,
      title: doc.title,
      description: doc.description,
      aiProvider: doc.aiProvider,
      location: doc.location,
      relatedWeatherDataIds: doc.relatedWeatherDataIds || [],
      metadata: doc.metadata || {},
      generatedAt: doc.createdAt || new Date(),
      createdAt: doc.createdAt || new Date(),
    };
  }

  /**
   * Criar um novo insight
   */
  async create(data: CreateInsightDTO): Promise<Insight> {
    const insight = new this.insightModel(data);
    const saved = await insight.save();
    return this.mapToEntity(saved.toObject());
  }

  /**
   * Buscar insight por ID
   */
  async findById(id: string): Promise<Insight | null> {
    const insight = await this.insightModel.findById(id).exec();
    return insight ? this.mapToEntity(insight.toObject()) : null;
  }

  /**
   * Buscar insights com filtros
   */
  async findAll(params: InsightQueryParams): Promise<Insight[]> {
    const filter: any = {};

    if (params.type) {
      filter.type = params.type;
    }

    if (params.priority) {
      filter.priority = params.priority;
    }

    if (params.location) {
      filter.location = params.location;
    }

    if (params.startDate || params.endDate) {
      filter.createdAt = {};
      if (params.startDate) {
        filter.createdAt.$gte = params.startDate;
      }
      if (params.endDate) {
        filter.createdAt.$lte = params.endDate;
      }
    }

    const insights = await this.insightModel
      .find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip(params.offset || 0)
      .limit(params.limit || 50)
      .exec();

    return insights.map((insight) => this.mapToEntity(insight.toObject()));
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
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return insights.map((insight) => this.mapToEntity(insight.toObject()));
  }

  /**
   * Buscar insights por weatherDataId
   */
  async findByWeatherDataId(weatherDataId: string): Promise<Insight[]> {
    const insights = await this.insightModel.find({ weatherDataId });
    return insights.map(insight => this.mapToEntity(insight.toObject()));
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
