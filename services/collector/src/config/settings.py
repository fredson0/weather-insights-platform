"""
Configurações do coletor
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Configurações da aplicação"""
    
    # Localização (Salvador, BA)
    LOCATION_NAME = 'Salvador, BA'
    LATITUDE = float(os.getenv('LATITUDE', '-12.9714'))
    LONGITUDE = float(os.getenv('LONGITUDE', '-38.5014'))
    
    # Open-Meteo API
    OPEN_METEO_API_URL = 'https://api.open-meteo.com/v1/forecast'
    HTTP_TIMEOUT = int(os.getenv('HTTP_TIMEOUT', '10'))
    
    # RabbitMQ
    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
    RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))
    RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'admin')
    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'admin123')
    RABBITMQ_EXCHANGE = os.getenv('RABBITMQ_EXCHANGE', 'weather-exchange')
    RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE', 'weather-data')
    RABBITMQ_ROUTING_KEY = os.getenv('RABBITMQ_ROUTING_KEY', 'weather.data')
    
    # Intervalo de coleta (minutos)
    COLLECTION_INTERVAL_MINUTES = int(os.getenv('COLLECTION_INTERVAL', '60'))
    COLLECTION_INTERVAL_SECONDS = COLLECTION_INTERVAL_MINUTES * 60

settings = Settings()

