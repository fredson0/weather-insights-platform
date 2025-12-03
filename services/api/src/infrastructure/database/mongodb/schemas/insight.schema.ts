import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InsightType, InsightPriority } from '../../../../core/domain/entities/insight.entity';

/**
 * Schema do MongoDB para Insight
 * Armazena insights gerados por IA sobre dados climáticos
 */
@Schema({ 
  timestamps: true,
  collection: 'insights'
})
export class InsightDocument extends Document {
  /**
   * Tipo do insight
   */
  @Prop({ 
    type: String,
    enum: Object.values(InsightType),
    required: true 
  })
  type: InsightType;

  /**
   * Prioridade do insight
   */
  @Prop({ 
    type: String,
    enum: Object.values(InsightPriority),
    required: true 
  })
  priority: InsightPriority;

  /**
   * Título do insight
   */
  @Prop({ required: true, trim: true })
  title: string;

  /**
   * Descrição detalhada do insight
   */
  @Prop({ required: true })
  description: string;

  /**
   * Provedor de IA usado (openai ou anthropic)
   */
  @Prop({ required: true })
  aiProvider: string;

  /**
   * Localização relacionada ao insight (opcional)
   */
  @Prop({ lowercase: true, trim: true })
  location?: string;

  /**
   * IDs dos dados climáticos relacionados
   */
  @Prop({ type: [Types.ObjectId], default: [] })
  relatedWeatherDataIds: Types.ObjectId[];

  /**
   * Metadados adicionais (JSON flexível)
   */
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  /**
   * Data/hora em que o insight foi gerado pela IA
   */
  @Prop({ required: true, type: Date, default: Date.now })
  generatedAt: Date;

  // timestamps: true adiciona:
  // createdAt: Date
  // updatedAt: Date
}

export const InsightSchema = SchemaFactory.createForClass(InsightDocument);

/**
 * Índices para otimizar queries
 */
InsightSchema.index({ type: 1, priority: -1 }); // Filtrar por tipo e prioridade
InsightSchema.index({ location: 1, generatedAt: -1 }); // Buscar por local + data
InsightSchema.index({ generatedAt: -1 }); // Ordenar por data de geração
InsightSchema.index({ priority: -1 }); // Ordenar por prioridade
