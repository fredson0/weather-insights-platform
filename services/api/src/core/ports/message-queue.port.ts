/**
 * Interface port para serviço de fila de mensagens
 * Permite que o domínio publique mensagens sem depender do RabbitMQ
 */
export interface IMessageQueueService {
  /**
   * Publicar uma mensagem em uma fila
   */
  publish(queue: string, message: any): Promise<boolean>;

  /**
   * Consumir mensagens de uma fila
   */
  consume(
    queue: string,
    handler: (message: any) => Promise<void>,
  ): Promise<void>;

  /**
   * Fechar conexão
   */
  close(): Promise<void>;
}
