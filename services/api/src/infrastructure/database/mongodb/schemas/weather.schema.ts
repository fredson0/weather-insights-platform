import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema do MongoDB para WeatherData
 * Armazena dados climáticos coletados de APIs externas
 */
@Schema({ 
  timestamps: true,
  collection: 'weather_data'
})
export class WeatherDocument extends Document {
  /**
   * Nome da localização
   */
  @Prop({ required: true, lowercase: true, trim: true })
  location: string;

  /**
   * Latitude da localização
   */
  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;

  /**
   * Longitude da localização
   */
  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;

  /**
   * Temperatura em Celsius
   */
  @Prop({ required: true })
  temperature: number;

  /**
   * Umidade em porcentagem
   */
  @Prop({ required: true, min: 0, max: 100 })
  humidity: number;

  /**
   * Velocidade do vento em km/h
   */
  @Prop({ required: true, min: 0 })
  windSpeed: number;

  /**
   * Direção do vento em graus (0-360)
   */
  @Prop({ required: true, min: 0, max: 360 })
  windDirection: number;

  /**
   * Precipitação em mm
   */
  @Prop({ required: true, min: 0 })
  precipitation: number;

  /**
   * Pressão atmosférica em hPa
   */
  @Prop({ required: true, min: 0 })
  pressure: number;

  /**
   * Cobertura de nuvens em porcentagem
   */
  @Prop({ required: true, min: 0, max: 100 })
  cloudCover: number;

  /**
   * Código WMO do tempo
   */
  @Prop({ required: true })
  weatherCode: number;

  /**
   * Data/hora da medição
   */
  @Prop({ required: true, type: Date })
  timestamp: Date;

  /**
   * Fonte dos dados (ex: 'open-meteo')
   */
  @Prop({ required: true })
  source: string;

  // timestamps: true adiciona:
  // createdAt: Date
  // updatedAt: Date
}

export const WeatherSchema = SchemaFactory.createForClass(WeatherDocument);

/**
 * Índices compostos para otimizar queries comuns
 */
WeatherSchema.index({ location: 1, timestamp: -1 }); // Buscar por local + data (mais recente primeiro)
WeatherSchema.index({ timestamp: -1 }); // Ordenar por data
WeatherSchema.index({ location: 1 }); // Buscar por localização
WeatherSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL: 90 dias (auto-delete)
