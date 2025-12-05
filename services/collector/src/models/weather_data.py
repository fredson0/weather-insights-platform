"""
Modelos de dados para o coletor
"""

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional

@dataclass
class WeatherData:
    """Dados meteorológicos para publicação no RabbitMQ"""
    
    location: str
    temperature: float
    humidity: float
    windSpeed: float
    precipitation: float
    condition: Optional[str] = None
    timestamp: Optional[str] = None
    
    def __post_init__(self):
        """Validação e formatação após inicialização"""
        if self.timestamp is None:
            self.timestamp = datetime.utcnow().isoformat() + 'Z'
        
        # Validações
        if not -50 <= self.temperature <= 60:
            raise ValueError(f'Temperatura inválida: {self.temperature}°C')
        
        if not 0 <= self.humidity <= 100:
            raise ValueError(f'Umidade inválida: {self.humidity}%')
        
        if self.windSpeed < 0:
            raise ValueError(f'Velocidade do vento inválida: {self.windSpeed} km/h')
    
    def to_dict(self) -> dict:
        """Converte para dicionário (JSON serializable)"""
        return asdict(self)
    
    def __str__(self) -> str:
        """Representação em string para logs"""
        return (
            f'WeatherData({self.location}: {self.temperature}°C, '
            f'{self.humidity}% umidade, {self.windSpeed} km/h vento)'
        )

