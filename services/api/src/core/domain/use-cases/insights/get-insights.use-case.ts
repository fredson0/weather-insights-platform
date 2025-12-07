import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InsightQueryParams } from '../../entities/insight.entity';

@Injectable()
export class GetInsightsUseCase {
  constructor(
    @InjectModel('Insight') private readonly insightModel: Model<any>,
  ) {}

  async execute(params: InsightQueryParams): Promise<any[]> {
    const query: any = {};
    
    if (params.type) query.type = params.type;
    if (params.priority) query.priority = params.priority;
    if (params.location) query.location = params.location;
    
    const insights = await this.insightModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(params.offset || 0)
      .limit(params.limit || 10);

    return insights.map(insight => ({
      id: insight._id.toString(),
      title: insight.title,
      description: insight.description,
      type: insight.type,
      priority: insight.priority,
      location: insight.location,
      createdAt: insight.createdAt,
    }));
  }
}
