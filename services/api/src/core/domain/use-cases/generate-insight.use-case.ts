import { Insight, CreateInsightDTO } from '../entities/insight.entity';
import { IInsightRepository } from '../repositories/insight.repository.interface';

export interface IGenerateInsightUseCase {
  execute(data: CreateInsightDTO): Promise<Insight>;
}

/**
 * Caso de Uso: Gerar e salvar um insight de IA
 * Regras de negócio:
 * - Validar que provedor de IA está configurado
 * - Definir timestamp de geração
 * - Associar com dados climáticos se fornecidos
 */
export class GenerateInsightUseCase implements IGenerateInsightUseCase {
  constructor(private readonly insightRepository: IInsightRepository) {}

  async execute(data: CreateInsightDTO): Promise<Insight> {
    const validProviders = ['openai', 'anthropic',];
    if (!validProviders.includes(data.aiProvider)){
        throw new Error(`Provedor de IA inválido. use: ${validProviders.join(', ')}`);
    }

    const insightData: CreateInsightDTO = {
        type: data.type,
      priority: data.priority,
      title: data.title.trim(),
      description: data.description.trim(),
      aiProvider: data.aiProvider,
      location: data.location?.toLowerCase().trim(),
      relatedWeatherDataIds: data.relatedWeatherDataIds || [], // Default: array vazio
      metadata: data.metadata || {}, // Default: objeto vazio
    };

    const insight = await this.insightRepository.create(insightData);

    return insight;
    
  }
}
