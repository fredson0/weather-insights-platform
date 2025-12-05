"""
Coletor de dados meteorológicos - Busca dados da Open-Meteo API
"""
import requests
import logging
from typing import Optional
from ..config.settings import settings
from ..models.weather_data import WeatherData

logger = logging.getLogger(__name__)

class WeatherCollector:
    """Coletor de dados meteorológicos da Open-Meteo API"""
    
    def __init__(self):
        self.api_url = settings.OPEN_METEO_API_URL
        self.latitude = settings.LATITUDE
        self.longitude = settings.LONGITUDE
        self.location_name = settings.LOCATION_NAME
        self.timeout = settings.HTTP_TIMEOUT
    
    def collect(self) -> Optional[WeatherData]:
        """
        Coleta dados meteorológicos atuais da API
        
        Returns:
            WeatherData se sucesso, None se falha
        """
        try:
            logger.info(f'Coletando dados meteorológicos para {self.location_name}...')
            
            # Parâmetros da API Open-Meteo
            params = {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
                'timezone': 'America/Sao_Paulo'
            }
            
            # Requisição HTTP
            response = requests.get(
                self.api_url,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            data = response.json()
            current = data.get('current', {})
            
            # Extrai dados
            weather_data = WeatherData(
                location=self.location_name,
                temperature=current.get('temperature_2m', 0.0),
                humidity=current.get('relative_humidity_2m', 0.0),
                windSpeed=current.get('wind_speed_10m', 0.0),
                precipitation=current.get('precipitation', 0.0),
                condition=self._get_condition(current)
            )
            
            logger.info(f'Dados coletados: {weather_data}')
            return weather_data
            
        except requests.exceptions.Timeout:
            logger.error(f'Timeout ao conectar na API Open-Meteo (>{self.timeout}s)')
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f'Erro na requisição HTTP: {e}')
            return None
        except ValueError as e:
            logger.error(f'Erro de validação: {e}')
            return None
        except Exception as e:
            logger.error(f'Erro inesperado ao coletar dados: {e}')
            return None
    
    def _get_condition(self, current_data: dict) -> str:
        """Determina condição climática baseada nos dados"""
        temp = current_data.get('temperature_2m', 0)
        precip = current_data.get('precipitation', 0)
        
        if precip > 5:
            return 'Rainy'
        elif precip > 0:
            return 'Light rain'
        elif temp > 30:
            return 'Hot and sunny'
        elif temp > 20:
            return 'Partly cloudy'
        else:
            return 'Cloudy'

