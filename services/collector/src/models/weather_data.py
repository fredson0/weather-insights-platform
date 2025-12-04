"""
Modelos de dados para o coletor
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Location:
    """Localização geográfica"""
    latitude: float
    longitude: float
    timezone: str

@dataclass
class WeatherData:
    """Dados climáticos"""
    temperature: float
    humidity: int
    wind_speed: float
    condition: str
    precipitation_probability: Optional[int] = 0

@dataclass
class WeatherLog:
    """Log completo de dados climáticos"""
    location: Location
    data: WeatherData
    timestamp: str
    source: str = 'open-meteo'
    
    def to_dict(self) -> dict:
        """Converte para dicionário para envio via JSON"""
        return {
            'location': {
                'latitude': self.location.latitude,
                'longitude': self.location.longitude,
                'timezone': self.location.timezone
            },
            'data': {
                'temperature': self.data.temperature,
                'humidity': self.data.humidity,
                'windSpeed': self.data.wind_speed,
                'condition': self.data.condition,
                'precipitationProbability': self.data.precipitation_probability
            },
            'timestamp': self.timestamp,
            'source': self.source
        }
