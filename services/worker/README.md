# 🔷 Go Worker

## 📋 Visão Geral

Worker desenvolvido em Go que consome mensagens da fila RabbitMQ e envia para a API NestJS.

## 🏗️ Estrutura

```
cmd/
└── worker/
    └── main.go                # Entry point

internal/
├── queue/
│   └── consumer.go            # Consumer do RabbitMQ
├── api/
│   └── client.go              # Client HTTP para API
├── models/
│   └── weather.go             # Modelos de dados
└── config/
    └── config.go              # Configurações

pkg/                           # Código reutilizável (se houver)
```

## 📦 Instalação

```bash
go mod download
```

## 🚀 Executar

### Desenvolvimento
```bash
go run cmd/worker/main.go
```

### Build
```bash
go build -o worker cmd/worker/main.go
./worker
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Worker
WORKER_LOG_LEVEL=info
WORKER_RETRY_ATTEMPTS=3
WORKER_RETRY_DELAY=5

# API
API_BASE_URL=http://localhost:3000

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
RABBITMQ_VHOST=/
RABBITMQ_QUEUE=weather-data
```

## 🔄 Fluxo de Execução

1. Conecta no RabbitMQ
2. Aguarda mensagens na fila
3. Valida dados recebidos
4. Tenta enviar para API NestJS
5. Se sucesso: ACK
6. Se erro: NACK e retry

## 🛡️ Tratamento de Erros

- ✅ Retry automático (3 tentativas)
- ✅ Exponential backoff
- ✅ Dead letter queue
- ✅ Logs detalhados

## 📊 Exemplo de Mensagem

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

## 🧪 Testes

```bash
go test ./...
```

## 🐛 Debug

```bash
# Logs verbosos
export WORKER_LOG_LEVEL=debug
go run cmd/worker/main.go
```

## 📦 Dependencies

- `github.com/rabbitmq/amqp091-go` - RabbitMQ client
- `github.com/joho/godotenv` - Variáveis de ambiente
- `encoding/json` - JSON parsing
- `net/http` - HTTP client
