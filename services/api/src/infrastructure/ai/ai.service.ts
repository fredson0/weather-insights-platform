import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherData } from '../../core/domain/entities/weather.entity';
import { IAIService } from '../../core/ports/ai.port';

/**
 * Serviço de integração com IA
 * 
 * RESPONSABILIDADE: Gerar insights inteligentes a partir de dados climáticos
 */
@Injectable()
export class AIService implements IAIService {
  constructor(private readonly configService: ConfigService) {}

  async generateWeatherInsight(
    weatherData: any[],
    context?: string,
  ): Promise<{
    title: string;
    description: string;
    priority: string;
    metadata: Record<string, any>;
  }> {
    const stats = this.calculateStatistics(weatherData);
    const location = context || 'Unknown';
    
    try {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      
      if (!apiKey) {
        return this.generateSimpleInsightObject(location, stats);
      }

      const prompt = this.buildPrompt(location, stats, weatherData);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0]) {
        const aiText = data.candidates[0].content.parts[0].text;
        return {
          title: `Análise Climática - ${location}`,
          description: aiText,
          priority: stats.avgTemp > 30 ? 'high' : 'medium',
          metadata: { stats, source: 'gemini-pro' },
        };
      }

      return this.generateSimpleInsightObject(location, stats);
    } catch (error) {
      return this.generateSimpleInsightObject(location, stats);
    }
  }

  async analyzeWeatherTrends(
    weatherData: any[],
  ): Promise<{
    trend: string;
    prediction: string;
    confidence: number;
  }> {
    const stats = this.calculateStatistics(weatherData);
    
    let trend = 'stable';
    if (weatherData.length >= 2) {
      const recent = weatherData[0].temperature;
      const old = weatherData[weatherData.length - 1].temperature;
      trend = recent > old + 2 ? 'increasing' : recent < old - 2 ? 'decreasing' : 'stable';
    }

    return {
      trend,
      prediction: trend === 'increasing' ? 'Temperatura pode continuar subindo' : 
                  trend === 'decreasing' ? 'Temperatura pode continuar caindo' : 
                  'Temperatura deve permanecer estável',
      confidence: 0.7,
    };
  }

  async detectAnomalies(
    weatherData: any[],
  ): Promise<{
    hasAnomaly: boolean;
    anomalies: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
  }> {
    const stats = this.calculateStatistics(weatherData);
    const anomalies: Array<{ type: string; severity: string; description: string }> = [];

    if (stats.maxTemp > 40) {
      anomalies.push({
        type: 'high_temperature',
        severity: 'high',
        description: `Temperatura extrema detectada: ${stats.maxTemp}°C`,
      });
    }

    if (stats.totalPrecipitation > 100) {
      anomalies.push({
        type: 'heavy_rain',
        severity: 'medium',
        description: `Precipitação alta: ${stats.totalPrecipitation}mm`,
      });
    }

    return {
      hasAnomaly: anomalies.length > 0,
      anomalies,
    };
  }

  private generateSimpleInsightObject(location: string, stats: any) {
    return {
      title: `Análise Climática - ${location}`,
      description: this.generateSimpleInsight(location, stats),
      priority: stats.avgTemp > 30 ? 'high' : 'medium',
      metadata: { stats, source: 'simple' },
    };
  }

  /**
   * Gera insight baseado em dados climáticos usando IA
   * @deprecated Use generateWeatherInsight instead
   */
  async generateInsight(
    weatherData: WeatherData[],
    location: string,
  ): Promise<string> {
    const result = await this.generateWeatherInsight(weatherData, location);
    return result.description;
  }

  /**
   * Calcula estatísticas dos dados climáticos
   */
  private calculateStatistics(weatherData: WeatherData[]) {
    if (weatherData.length === 0) {
      return {
        avgTemp: 0,
        minTemp: 0,
        maxTemp: 0,
        avgHumidity: 0,
        avgWindSpeed: 0,
        totalPrecipitation: 0,
        dataPoints: 0,
      };
    }

    const temps = weatherData.map((d) => d.temperature);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const avgHumidity =
      weatherData.reduce((a, b) => a + b.humidity, 0) / weatherData.length;
    const avgWindSpeed =
      weatherData.reduce((a, b) => a + b.windSpeed, 0) / weatherData.length;
    const totalPrecipitation = weatherData.reduce(
      (a, b) => a + b.precipitation,
      0,
    );

    return {
      avgTemp: Math.round(avgTemp * 10) / 10,
      minTemp: Math.round(minTemp * 10) / 10,
      maxTemp: Math.round(maxTemp * 10) / 10,
      avgHumidity: Math.round(avgHumidity),
      avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
      totalPrecipitation: Math.round(totalPrecipitation * 10) / 10,
      dataPoints: weatherData.length,
    };
  }

  /**
   * Monta prompt para a IA
   */
  private buildPrompt(location: string, stats: any, weatherData: WeatherData[]): string {
    const startDate = new Date(
      Math.min(...weatherData.map((d) => new Date(d.timestamp).getTime())),
    ).toLocaleDateString('pt-BR');
    const endDate = new Date(
      Math.max(...weatherData.map((d) => new Date(d.timestamp).getTime())),
    ).toLocaleDateString('pt-BR');

    return `Você é um meteorologista analisando dados climáticos de ${location}.

Dados do período de ${startDate} a ${endDate}:
- Temperatura: média ${stats.avgTemp}°C, mínima ${stats.minTemp}°C, máxima ${stats.maxTemp}°C
- Umidade média: ${stats.avgHumidity}%
- Velocidade do vento média: ${stats.avgWindSpeed} km/h
- Precipitação total: ${stats.totalPrecipitation} mm
- Total de medições: ${stats.dataPoints}

Gere um insight breve (máximo 3 linhas) sobre o clima, destacando pontos importantes e dando recomendações úteis para as pessoas.`;
  }

  /**
   * Gera insight simples sem IA (fallback)
   */
  private generateSimpleInsight(location: string, stats: any): string {
    let insight = `Em ${location}, a temperatura média registrada foi de ${stats.avgTemp}°C, `;
    insight += `variando entre ${stats.minTemp}°C e ${stats.maxTemp}°C. `;

    if (stats.totalPrecipitation > 10) {
      insight += `Período chuvoso com ${stats.totalPrecipitation}mm de precipitação. `;
    } else if (stats.totalPrecipitation > 0) {
      insight += `Chuvas leves com ${stats.totalPrecipitation}mm de precipitação. `;
    } else {
      insight += 'Período sem chuvas. ';
    }

    if (stats.avgHumidity > 80) {
      insight += 'Umidade elevada.';
    } else if (stats.avgHumidity < 40) {
      insight += 'Baixa umidade do ar.';
    }

    return insight;
  }
}
