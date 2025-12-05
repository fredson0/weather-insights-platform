import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GetInsightsUseCase {
  constructor(
    @InjectModel('Insight') private readonly insightModel: Model<any>,
  ) {}

  async execute(limit: number = 10): Promise<any[]> {
    const insights = await this.insightModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return insights.map(insight => ({
      id: insight._id.toString(),
      title: insight.title,
      content: insight.content,
      type: insight.type,
      weatherDataId: insight.weatherDataId,
      createdAt: insight.createdAt,
    }));
  }
}
