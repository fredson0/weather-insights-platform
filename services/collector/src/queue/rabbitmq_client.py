"""
Cliente RabbitMQ para envio de mensagens
"""

import json
import pika
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

class RabbitMQClient:
    """Cliente para comunicação com RabbitMQ"""
    
    def __init__(self, host: str, port: int, user: str, password: str, 
                 exchange: str, queue: str, routing_key: str):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.exchange = exchange
        self.queue = queue
        self.routing_key = routing_key
        
        self.connection: Optional[pika.BlockingConnection] = None
        self.channel: Optional[pika.channel.Channel] = None
        
    def connect(self) -> None:
        """Estabelece conexão com RabbitMQ e declara exchange/queue"""
        try:
            credentials = pika.PlainCredentials(self.user, self.password)
            parameters = pika.ConnectionParameters(
                host=self.host,
                port=self.port,
                credentials=credentials,
                heartbeat=600,
                blocked_connection_timeout=300
            )
            
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            
            # Declarar exchange do tipo direct (mensagens roteadas por routing_key exata)
            self.channel.exchange_declare(
                exchange=self.exchange,
                exchange_type='direct',
                durable=True
            )
            
            # Declarar fila durável (mensagens persistem após restart do RabbitMQ)
            self.channel.queue_declare(queue=self.queue, durable=True)
            
            # Bind queue ao exchange com routing_key
            self.channel.queue_bind(
                exchange=self.exchange,
                queue=self.queue,
                routing_key=self.routing_key
            )
            
            logger.info(f"✅ Conectado ao RabbitMQ {self.host}:{self.port} - Exchange: {self.exchange}, Queue: {self.queue}")
            
        except pika.exceptions.AMQPConnectionError as e:
            logger.error(f"❌ Erro de conexão com RabbitMQ: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Erro inesperado ao conectar no RabbitMQ: {e}")
            raise
            
    def publish(self, data: Dict) -> None:
        """
        Publica mensagem na fila RabbitMQ
        
        Args:
            data: Dicionário com dados climáticos (WeatherData.to_dict())
        """
        try:
            if not self.channel or self.connection.is_closed:
                logger.info("Reconectando ao RabbitMQ...")
                self.connect()
            
            message = json.dumps(data, ensure_ascii=False)
            
            self.channel.basic_publish(
                exchange=self.exchange,
                routing_key=self.routing_key,
                body=message,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Mensagem persistente (sobrevive a restart do RabbitMQ)
                    content_type='application/json'
                )
            )
            
            logger.info(f"📤 Mensagem publicada na fila {self.queue}: {data.get('location')} - {data.get('temperature')}°C")
            
        except pika.exceptions.AMQPError as e:
            logger.error(f"❌ Erro AMQP ao publicar mensagem: {e}")
            self.close()
            raise
        except json.JSONEncoder as e:
            logger.error(f"❌ Erro ao serializar dados para JSON: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Erro inesperado ao publicar mensagem: {e}")
            self.close()
            raise
            
    def close(self) -> None:
        """Fecha conexão com RabbitMQ de forma segura"""
        try:
            if self.connection and not self.connection.is_closed:
                self.connection.close()
                logger.info("🔌 Conexão com RabbitMQ fechada")
        except Exception as e:
            logger.error(f"⚠️ Erro ao fechar conexão com RabbitMQ: {e}")
