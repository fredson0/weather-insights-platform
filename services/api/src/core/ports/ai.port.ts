/**
 * Interface port para provedores de serviços de IA
 * Permite que o domínio use serviços de IA sem depender de implementações específicas
 */
export interface IAIService {
  /**
   * Gerar insights climáticos usando IA
   */
  generateWeatherInsight(
    weatherData: any[],
    context?: string,
  ): Promise<{
    title: string;
    description: string;
    priority: string;
    metadata: Record<string, any>;
  }>;

  /**
   * Analisar tendências climáticas
   */
  analyzeWeatherTrends(
    weatherData: any[],
  ): Promise<{
    trend: string;
    prediction: string;
    confidence: number;
  }>;

  /**
   * Detectar anomalias climáticas
   */
  detectAnomalies(
    weatherData: any[],
  ): Promise<{
    hasAnomaly: boolean;
    anomalies: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
  }>;
}
