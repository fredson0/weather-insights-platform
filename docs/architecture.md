# 🏗️ Arquitetura do Sistema GDASH Weather Insights

## 📋 Visão Geral

Este sistema segue uma arquitetura **Clean Architecture** (backend) combinada com **Feature-First** (frontend), garantindo separação de responsabilidades, testabilidade e escalabilidade.

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│  Python         │ 1. Coleta dados climáticos (Open-Meteo API)
│  Collector      │ 2. Normaliza e envia para fila
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RabbitMQ       │ 3. Armazena mensagens em fila
│  Message Broker │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Go Worker      │ 4. Consome fila
│                 │ 5. Valida dados
│                 │ 6. Envia para API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  NestJS API     │ 7. Persiste no MongoDB
│                 │ 8. Gera insights com IA
│  (Clean Arch)   │ 9. Expõe endpoints REST
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React          │ 10. Consome API
│  Frontend       │ 11. Exibe Dashboard
│  (Vite)         │ 12. Visualiza insights
└─────────────────┘
```

## 🏛️ Camadas da Clean Architecture (Backend)

### 1️⃣ **Core (Domain Layer)**
**Camada mais interna - regras de negócio puras**

```
core/
├── domain/
│   ├── entities/          # Entidades de domínio (User, WeatherLog)
│   ├── repositories/      # Interfaces dos repositórios
│   └── use-cases/         # Casos de uso (regras de negócio)
└── ports/                 # Interfaces para serviços externos
```

**Princípios:**
- ❌ NÃO depende de frameworks
- ❌ NÃO conhece banco de dados
- ✅ Apenas lógica de negócio
- ✅ Fácil de testar (unitário)

### 2️⃣ **Application Layer**
**Orquestração de casos de uso**

```
application/
├── auth/                  # Autenticação e autorização
├── users/                 # Gestão de usuários
├── weather/               # Gestão de dados climáticos
└── insights/              # Geração de insights com IA
```

**Responsabilidades:**
- Orquestrar use cases
- Validar entrada de dados
- Coordenar repositórios e serviços

### 3️⃣ **Infrastructure Layer**
**Implementações concretas**

```
infrastructure/
├── database/
│   ├── mongodb/           # Conexão MongoDB
│   └── repositories/      # Implementação dos repositórios
├── external-apis/         # Clientes de APIs externas
├── ai/                    # Integração com OpenAI/Anthropic
└── export/                # Exportação CSV/XLSX
```

**Responsabilidades:**
- Implementar interfaces do domínio
- Conectar com banco de dados
- Integrar com APIs externas
- Gerenciar infraestrutura

### 4️⃣ **Presentation Layer**
**Camada de apresentação (HTTP)**

```
presentation/
├── controllers/           # Endpoints REST
├── dtos/                  # Data Transfer Objects
├── guards/                # Guards de autenticação
└── filters/               # Filtros de exceção
```

**Responsabilidades:**
- Receber requisições HTTP
- Validar entrada (DTOs)
- Retornar respostas formatadas
- Aplicar autenticação/autorização

## 🎨 Estrutura Feature-First (Frontend)

```
features/
├── auth/                  # Login, logout, guards
├── dashboard/             # Dashboard principal
├── users/                 # CRUD de usuários
└── explore/               # API pública (opcional)
```

Cada feature contém:
- `components/` - Componentes React
- `hooks/` - Custom hooks
- `services/` - Chamadas API
- `types/` - TypeScript types

## 🔐 Padrões de Segurança

1. **Autenticação JWT** - Token-based auth
2. **Guards** - Proteção de rotas
3. **Validation Pipes** - Validação automática (class-validator)
4. **Password Hashing** - bcrypt
5. **CORS** - Configurado corretamente

## 📊 Banco de Dados (MongoDB)

### Collections:

**users**
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

**weather_logs**
```typescript
{
  _id: ObjectId,
  location: {
    latitude: number,
    longitude: number,
    timezone: string
  },
  data: {
    temperature: number,
    humidity: number,
    windSpeed: number,
    condition: string,
    precipitationProbability: number
  },
  timestamp: Date,
  source: string,
  createdAt: Date
}
```

**insights**
```typescript
{
  _id: ObjectId,
  type: string,  // 'comfort', 'alert', 'trend'
  title: string,
  description: string,
  score: number,
  metadata: object,
  generatedAt: Date
}
```

## 🔌 APIs Externas

1. **Open-Meteo** - Dados climáticos (sem API key)
2. **PokéAPI** (opcional) - Exemplo de integração paginada
3. **OpenAI/Anthropic** (opcional) - Geração de insights avançados

## 🧪 Testes

- **Unit Tests** - Use cases, serviços
- **Integration Tests** - Repositórios, controllers
- **E2E Tests** - Fluxo completo (opcional)

## 🚀 Escalabilidade

1. **Horizontal Scaling** - API stateless
2. **Message Queue** - Processamento assíncrono
3. **Caching** - Redis (futuro)
4. **CDN** - Assets estáticos (produção)

## 📦 Docker

Todos os serviços rodam em containers isolados:
- `mongodb` - Persistência
- `rabbitmq` - Fila de mensagens
- `api` - Backend NestJS
- `collector` - Coletor Python
- `worker` - Consumidor Go
- `web` - Frontend React

## 🎯 Benefícios da Arquitetura

✅ **Testabilidade** - Camadas isoladas  
✅ **Manutenibilidade** - Código organizado  
✅ **Escalabilidade** - Fácil adicionar features  
✅ **Independência** - Framework agnóstico (core)  
✅ **Clareza** - Separação de responsabilidades  
