export enum InsightType {
  WEATHER_ANALYSIS = 'weather_analysis',
  TREND_PREDICTION = 'trend_prediction',
  ANOMALY_DETECTION = 'anomaly_detection',
  RECOMMENDATION = 'recommendation',
}

export enum InsightPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Insight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  aiProvider: string; // 'openai' | 'anthropic'
  location?: string;
  relatedWeatherDataIds: string[];
  metadata: Record<string, any>;
  generatedAt: Date;
  createdAt: Date;
}

export interface CreateInsightDTO {
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  aiProvider: string;
  location?: string;
  relatedWeatherDataIds?: string[];
  metadata?: Record<string, any>;
}

export interface InsightQueryParams {
  type?: InsightType;
  priority?: InsightPriority;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
