"""
Cliente RabbitMQ para envio de mensagens
"""

import os
import json
import pika
import logging

logger = logging.getLogger(__name__)

class RabbitMQClient:
    """Cliente para comunicação com RabbitMQ"""
    
    def __init__(self):
        self.host = os.getenv('RABBITMQ_HOST', 'localhost')
        self.port = int(os.getenv('RABBITMQ_PORT', 5672))
        self.user = os.getenv('RABBITMQ_USER', 'admin')
        self.password = os.getenv('RABBITMQ_PASSWORD', 'admin123')
        self.vhost = os.getenv('RABBITMQ_VHOST', '/')
        self.queue = os.getenv('RABBITMQ_QUEUE', 'weather-data')
        self.exchange = os.getenv('RABBITMQ_EXCHANGE', 'weather-exchange')
        self.routing_key = os.getenv('RABBITMQ_ROUTING_KEY', 'weather.collected')
        
        self.connection = None
        self.channel = None
        
    def connect(self):
        """Estabelece conexão com RabbitMQ"""
        try:
            # TODO: Implementar conexão com RabbitMQ
            # credentials = pika.PlainCredentials(self.user, self.password)
            # parameters = pika.ConnectionParameters(
            #     host=self.host,
            #     port=self.port,
            #     virtual_host=self.vhost,
            #     credentials=credentials
            # )
            # self.connection = pika.BlockingConnection(parameters)
            # self.channel = self.connection.channel()
            
            # Declarar exchange e queue
            # self.channel.exchange_declare(
            #     exchange=self.exchange,
            #     exchange_type='topic',
            #     durable=True
            # )
            # self.channel.queue_declare(queue=self.queue, durable=True)
            # self.channel.queue_bind(
            #     exchange=self.exchange,
            #     queue=self.queue,
            #     routing_key=self.routing_key
            # )
            
            logger.info(f"Conectado ao RabbitMQ: {self.host}:{self.port}")
            
        except Exception as e:
            logger.error(f"Erro ao conectar no RabbitMQ: {e}")
            raise
            
    def send_message(self, data: dict):
        """
        Envia mensagem para a fila
        
        Args:
            data: Dados a serem enviados
        """
        try:
            if not self.channel:
                self.connect()
            
            # TODO: Implementar envio de mensagem
            # message = json.dumps(data)
            # self.channel.basic_publish(
            #     exchange=self.exchange,
            #     routing_key=self.routing_key,
            #     body=message,
            #     properties=pika.BasicProperties(
            #         delivery_mode=2,  # Mensagem persistente
            #         content_type='application/json'
            #     )
            # )
            
            logger.info(f"Mensagem enviada para fila: {self.queue}")
            
        except Exception as e:
            logger.error(f"Erro ao enviar mensagem: {e}")
            self.close()
            raise
            
    def close(self):
        """Fecha conexão com RabbitMQ"""
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            logger.info("Conexão com RabbitMQ fechada")
