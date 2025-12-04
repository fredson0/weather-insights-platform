#!/usr/bin/env python3
"""
GDASH Weather Collector
Coleta dados climáticos e envia para RabbitMQ
"""

import os
import time
import logging
from dotenv import load_dotenv

# TODO: Importar seus módulos conforme implementar
# from src.collectors.weather_collector import WeatherCollector
# from src.queue.rabbitmq_client import RabbitMQClient

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

def main():
    """Entry point do coletor"""
    logger.info("🚀 Iniciando GDASH Weather Collector...")
    
    # Configurações do .env
    interval = int(os.getenv('COLLECTOR_INTERVAL', 3600))
    
    logger.info(f"⏰ Intervalo de coleta: {interval} segundos ({interval/60} minutos)")
    
    # TODO: Inicializar seu coletor e cliente RabbitMQ
    # collector = WeatherCollector()
    # rabbitmq = RabbitMQClient()
    
    try:
        while True:
            try:
                logger.info("📊 Iniciando coleta de dados climáticos...")
                
                # TODO: Implementar lógica de coleta
                # data = collector.fetch_weather_data()
                # rabbitmq.send_message(data)
                
                logger.info("✅ Dados coletados e enviados com sucesso!")
                
            except Exception as e:
                logger.error(f"❌ Erro durante coleta: {e}")
            
            logger.info(f"⏳ Aguardando {interval} segundos para próxima coleta...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        logger.info("⛔ Coletor interrompido pelo usuário")
    except Exception as e:
        logger.error(f"💥 Erro fatal: {e}")
        raise

if __name__ == '__main__':
    main()
