#!/usr/bin/env python3
"""
GDASH Weather Collector
Coleta dados climáticos de Salvador/BA e envia para RabbitMQ
"""

import time
import logging
import signal
import sys
from dotenv import load_dotenv

from src.config.settings import settings
from src.collectors.weather_collector import WeatherCollector
from src.queue.rabbitmq_client import RabbitMQClient

# Configurar logging com formatação detalhada
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

class CollectorService:
    """Serviço principal do coletor de dados climáticos"""
    
    def __init__(self):
        self.weather_collector = WeatherCollector(
            latitude=settings.LATITUDE,
            longitude=settings.LONGITUDE
        )
        
        self.rabbitmq_client = RabbitMQClient(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT,
            user=settings.RABBITMQ_USER,
            password=settings.RABBITMQ_PASSWORD,
            exchange=settings.RABBITMQ_EXCHANGE,
            queue=settings.RABBITMQ_QUEUE,
            routing_key=settings.RABBITMQ_ROUTING_KEY
        )
        
        self.running = False
        
    def collect_and_publish(self) -> None:
        """Coleta dados climáticos e publica no RabbitMQ"""
        try:
            logger.info(f"📊 Coletando dados climáticos de {settings.LOCATION_NAME}...")
            
            # Coletar dados da API Open-Meteo
            weather_data = self.weather_collector.collect()
            
            if weather_data is None:
                logger.warning("⚠️ Nenhum dado climático coletado. Tentando novamente na próxima iteração.")
                return
            
            logger.info(f"🌡️ Dados coletados: {weather_data}")
            
            # Publicar no RabbitMQ
            self.rabbitmq_client.publish(weather_data.to_dict())
            
            logger.info("✅ Dados enviados com sucesso para o RabbitMQ!")
            
        except Exception as e:
            logger.error(f"❌ Erro durante coleta e envio: {e}", exc_info=True)
    
    def start(self) -> None:
        """Inicia o serviço de coleta periódica"""
        logger.info("🚀 Iniciando GDASH Weather Collector...")
        logger.info(f"📍 Localização: {settings.LOCATION_NAME}")
        logger.info(f"🌐 Coordenadas: Lat {settings.LATITUDE}, Lon {settings.LONGITUDE}")
        logger.info(f"⏰ Intervalo de coleta: {settings.COLLECTION_INTERVAL_MINUTES} minutos ({settings.COLLECTION_INTERVAL_SECONDS} segundos)")
        logger.info(f"🔌 RabbitMQ: {settings.RABBITMQ_HOST}:{settings.RABBITMQ_PORT}")
        logger.info(f"📤 Exchange: {settings.RABBITMQ_EXCHANGE} → Queue: {settings.RABBITMQ_QUEUE}")
        
        try:
            # Conectar ao RabbitMQ
            self.rabbitmq_client.connect()
            
            # Executar primeira coleta imediatamente
            logger.info("🏁 Executando primeira coleta...")
            self.collect_and_publish()
            
            # Loop principal com intervalo configurado
            self.running = True
            interval_seconds = settings.COLLECTION_INTERVAL_SECONDS
            
            while self.running:
                logger.info(f"⏳ Aguardando {settings.COLLECTION_INTERVAL_MINUTES} minutos para próxima coleta...")
                time.sleep(interval_seconds)
                
                if self.running:  # Verificar se não foi interrompido durante sleep
                    self.collect_and_publish()
                    
        except KeyboardInterrupt:
            logger.info("⛔ Coletor interrompido pelo usuário (Ctrl+C)")
        except Exception as e:
            logger.error(f"💥 Erro fatal no serviço: {e}", exc_info=True)
            raise
        finally:
            self.stop()
    
    def stop(self) -> None:
        """Para o serviço e fecha conexões"""
        logger.info("🛑 Encerrando serviço...")
        self.running = False
        
        try:
            self.rabbitmq_client.close()
        except Exception as e:
            logger.error(f"Erro ao fechar conexão RabbitMQ: {e}")
        
        logger.info("👋 Serviço encerrado com sucesso")

def signal_handler(signum, frame):
    """Handler para sinais de sistema (SIGINT, SIGTERM)"""
    logger.info(f"\n📡 Sinal {signum} recebido. Encerrando gracefully...")
    sys.exit(0)

def main():
    """Entry point do coletor"""
    # Configurar handlers de sinais para shutdown graceful
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Carregar variáveis de ambiente do .env
    load_dotenv()
    
    # Iniciar serviço
    service = CollectorService()
    service.start()

if __name__ == '__main__':
    main()
