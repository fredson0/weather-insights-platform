import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { IMessageQueueService } from '../../core/ports/message-queue.port';

/**
 * Serviço de integração com RabbitMQ
 * 
 * RESPONSABILIDADE: Publicar mensagens na fila para processamento assíncrono
 */
@Injectable()
export class RabbitMQService implements IMessageQueueService, OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  private readonly EXCHANGE_NAME = 'weather-exchange';
  private readonly QUEUE_NAME = 'weather-data';
  private readonly ROUTING_KEY = 'weather.data';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Inicializa conexão com RabbitMQ ao iniciar o módulo
   */
  async onModuleInit() {
    await this.connect();
  }

  /**
   * Fecha conexão com RabbitMQ ao destruir o módulo
   */
  async onModuleDestroy() {
    await this.disconnect();
  }

  /**
   * Conecta ao RabbitMQ e configura exchange/queue
   */
  private async connect(): Promise<void> {
    try {
      const host = this.configService.get<string>('RABBITMQ_HOST', 'localhost');
      const port = this.configService.get<number>('RABBITMQ_PORT', 5672);
      const user = this.configService.get<string>('RABBITMQ_USER', 'admin');
      const password = this.configService.get<string>('RABBITMQ_PASSWORD', 'admin123');
      const vhost = this.configService.get<string>('RABBITMQ_VHOST', '/');

      const url = `amqp://${user}:${password}@${host}:${port}${vhost}`;

      // Conectar ao RabbitMQ
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Configurar exchange (durável - sobrevive a restart)
      await this.channel.assertExchange(this.EXCHANGE_NAME, 'direct', {
        durable: true,
      });

      // Configurar queue (durável - sobrevive a restart)
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true,
      });

      // Fazer binding entre exchange e queue
      await this.channel.bindQueue(
        this.QUEUE_NAME,
        this.EXCHANGE_NAME,
        this.ROUTING_KEY,
      );

      this.logger.log('Conectado ao RabbitMQ com sucesso');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ', error);
      throw error;
    }
  }

  /**
   * Desconecta do RabbitMQ
   */
  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Desconectado do RabbitMQ');
    } catch (error) {
      this.logger.error('Erro ao desconectar do RabbitMQ', error);
    }
  }

  /**
   * Publica mensagem de dados climáticos na fila
   */
  async publishWeatherData(data: any): Promise<boolean> {
    return this.publish(this.QUEUE_NAME, data);
  }

  async publish(queue: string, message: any): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('Canal RabbitMQ não está conectado');
      }

      const messageStr = JSON.stringify(message);
      const buffer = Buffer.from(messageStr);

      const published = this.channel.publish(
        this.EXCHANGE_NAME,
        this.ROUTING_KEY,
        buffer,
        {
          persistent: true,
          contentType: 'application/json',
          timestamp: Date.now(),
        },
      );

      if (published) {
        this.logger.log(`Mensagem publicada na fila ${queue}`);
      }

      return published;
    } catch (error) {
      this.logger.error('Erro ao publicar mensagem no RabbitMQ', error);
      throw error;
    }
  }

  async consume(
    queue: string,
    handler: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('Canal RabbitMQ não está conectado');
      }

      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Erro ao processar mensagem', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      this.logger.log(`Consumindo mensagens da fila ${queue}`);
    } catch (error) {
      this.logger.error('Erro ao consumir mensagens', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.disconnect();
  }
}
