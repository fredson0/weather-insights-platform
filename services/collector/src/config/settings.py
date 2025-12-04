"""
Configurações do coletor
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Configurações da aplicação"""
    
    # Intervalo de coleta
    COLLECTOR_INTERVAL = int(os.getenv('COLLECTOR_INTERVAL', 3600))
    
    # API de clima
    WEATHER_API_URL = os.getenv('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast')
    WEATHER_LATITUDE = os.getenv('WEATHER_LATITUDE', '-23.5505')
    WEATHER_LONGITUDE = os.getenv('WEATHER_LONGITUDE', '-46.6333')
    WEATHER_TIMEZONE = os.getenv('WEATHER_TIMEZONE', 'America/Sao_Paulo')
    
    # RabbitMQ
    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
    RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))
    RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'admin')
    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'admin123')
    RABBITMQ_VHOST = os.getenv('RABBITMQ_VHOST', '/')
    RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE', 'weather-data')
    RABBITMQ_EXCHANGE = os.getenv('RABBITMQ_EXCHANGE', 'weather-exchange')
    RABBITMQ_ROUTING_KEY = os.getenv('RABBITMQ_ROUTING_KEY', 'weather.collected')

settings = Settings()
