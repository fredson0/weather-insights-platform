# 🐍 Python Collector

## 📋 Visão Geral

Coletor de dados climáticos que busca informações periodicamente e envia para a fila RabbitMQ.

## 🏗️ Estrutura

```
src/
├── collectors/
│   ├── weather_collector.py   # Client da API de clima
│   └── base_collector.py      # Classe base
├── queue/
│   └── rabbitmq_client.py     # Client do RabbitMQ
├── models/
│   └── weather_data.py        # Modelos de dados
├── config/
│   └── settings.py            # Configurações
└── main.py                    # Entry point
```

## 📦 Instalação

```bash
pip install -r requirements.txt
```

## 🚀 Executar

```bash
python main.py
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Intervalo de coleta (segundos)
COLLECTOR_INTERVAL=3600

# API de clima (Open-Meteo)
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_LATITUDE=-23.5505
WEATHER_LONGITUDE=-46.6333
WEATHER_TIMEZONE=America/Sao_Paulo

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
RABBITMQ_QUEUE=weather-data
RABBITMQ_EXCHANGE=weather-exchange
RABBITMQ_ROUTING_KEY=weather.collected
```

## 🌦️ APIs Suportadas

### Open-Meteo (Padrão)
- ✅ Gratuita
- ✅ Sem API key
- ✅ Dados precisos

### OpenWeather (Alternativa)
- ⚠️ Requer API key
- ✅ Mais opções de dados

## 📊 Formato dos Dados

```json
{
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333,
    "timezone": "America/Sao_Paulo"
  },
  "data": {
    "temperature": 25.5,
    "humidity": 65,
    "windSpeed": 12.5,
    "condition": "partly_cloudy",
    "precipitationProbability": 20
  },
  "timestamp": "2025-12-03T10:30:00Z",
  "source": "open-meteo"
}
```

## 🔄 Fluxo de Execução

1. Aguarda intervalo configurado
2. Busca dados da API de clima
3. Normaliza dados
4. Envia para fila RabbitMQ
5. Repete

## 🐛 Debug

```bash
# Modo verbose
python main.py --verbose

# Testar coleta única
python main.py --once
```
