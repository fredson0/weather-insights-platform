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

  /**
   * Gera insight baseado em dados climáticos usando IA
   */
  async generateInsight(
    weatherData: WeatherData[],
    location: string,
  ): Promise<string> {
    try {
      // Preparar estatísticas dos dados
      const stats = this.calculateStatistics(weatherData);

      // Montar prompt para a IA
      const prompt = this.buildPrompt(location, stats, weatherData);

      // Chamar Google Gemini API
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');

      if (!apiKey) {
        // Fallback: retornar insight simples sem IA
        return this.generateSimpleInsight(location, stats);
      }

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
        return data.candidates[0].content.parts[0].text;
      }

      // Se IA falhar, retornar insight simples
      return this.generateSimpleInsight(location, stats);
    } catch (error) {
      // Em caso de erro, retornar insight simples
      const stats = this.calculateStatistics(weatherData);
      return this.generateSimpleInsight(location, stats);
    }
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
