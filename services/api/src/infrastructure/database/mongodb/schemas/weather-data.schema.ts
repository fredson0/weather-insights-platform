import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WeatherData extends Document {
  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ required: true })
  windDirection: number;

  @Prop({ required: true })
  precipitation: number;

  @Prop({ required: true })
  pressure: number;

  @Prop({ required: true })
  cloudCover: number;

  @Prop({ required: true })
  weatherCode: number;

  @Prop({ default: 'open-meteo' })
  source: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const WeatherDataSchema = SchemaFactory.createForClass(WeatherData);
